// 3rd party
const { join } = require('path');
const moment = require('moment');
const schedule = require('node-schedule');

// Project
const gcs = require('./google-cloud');
const snap = require('./snapshot.js');

// Config
// TODO: Validate this against the expected schema.
const config = require('../config/archiver.json');
const sites = require('../config/sites');


async function validateUpload (site) {
  const metadata = await gcs.metadata(site.filePath);

  /* Require that a site's snapshot is > 25kb, or else assume it's broken. Yes,
     this is pretty fragile, but the alternative is getting into CV stuff to
     actually analyze the image, and that'll have to wait for another day.

     The real-world issue this attempts to detect is snapshots that are mostly
     blank / white, either because they failed to load, or they're covered by
     a full-screen video or something (which Phantom doesn't support).
     */
   const fileSize = metadata[0].size;
   if (metadata[0].size > 25000) {
     return Promise.resolve(fileSize);
   } else {
     return Promise.reject(new Error(`Size of saved snapshot was only ${fileSize}b`));
   }
}

// Wrap the streaming snapshot + GCS write into a promise
async function processSite (site, force) {
  const destStream = await gcs.stream(site.filePath);
  return new Promise((resolve, reject) => {
    snap.stream(site, force)
      .on('error', (err) => reject(err))
      .pipe(destStream)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err));
  })
  .then(() => { return validateUpload(site); })
  .then(() => { return Promise.resolve(site); })
  .catch((e) => {
    console.log(`ERROR: failed processing ${site.name} - ${e.message}`);
    return Promise.resolve(false);
  });
}

// Global
var nextJob;

async function processAll () {
  const now = moment().utc();
  console.log(`Starting site archive for ${now.toString()}`);

  // Timestmap for use in file names
  const ts = now.format('YYYY-MM-DD_HH');

  // Set the folder to the interval we're in. For instance, if run at 9:25am,
  // with freq = 4 hours, then the folder name is 08
  const freq = config.frequency;
  const folderHours = Math.floor(now.hour() / freq) * freq;
  const dateString = now.format('YYYY-MM-DD');
  const dstFolder = `${dateString}_${folderHours < 10 ? 0 : ''}${folderHours}`;

  var manifestData = {
    basePath: dstFolder,
    timestamp: now.toISOString(),
    sites: []
  };

  // Process each site
  for (const i in sites) {
    const site = sites[i];
    console.log(site.name);
    site.filePath = join(dstFolder, `${ts}-${site.shortName}.jpg`);

    var maxRetries;
    var retries = maxRetries = config.retries;
    var result;
    while (retries > 0) {
      var force = retries == 1; // force if it's our last chance
      result = await processSite(site, force);
      if (result) { break; }
      else { retries--; }
    }
    if (result) {
      manifestData.sites.push(result);
    } else {
      console.log(`ERROR: gave up processing ${site.name} after ${maxRetries} failed attempts`);
    }
  }

  // Write manifests
  const manifestPath = join(dstFolder, 'manifest.json');
  const latestPath = 'latest.json';
  try {
    console.log('manifest.json');
    await gcs.writeJSON(manifestPath, manifestData);
    console.log('latest.json');
    await gcs.writeJSON(latestPath, manifestData);
  } catch (e) {
    console.log(`ERROR: could not write manifest to ${manifestPath} - ${e.message}`)
  }
  console.log(`Finished archiving at ${moment().utc().toString()}`);

  if (nextJob) {
    console.log(`Next run scheduled for ${nextJob.nextInvocation().toString()}`);
  }

  return;
}


// Always run on startup
processAll().then(() => {
  // Schedule to run every hour
  /* TODO: There's a risk that if the script is started near the end of the
     current interval, it will skip the next execution. For instance, if the
     initial invocation is at 8:59, and takes two minutes to complete, the
     "schedule next" part here won't execute until 9:01, scheduling a timer for
     10:00, and we'll completely miss 9:00.

     This isn't likely to be a real issue unless this script dies a lot.

     A better, though significantly more complicated approach, is to create a
     worker (or pool of workers) that process screenshots from a FIFO queue, and
     to just have the scheduled event push tasks into the queue. I'm not sure
     that's worth it at any expected scale for this app though -db.
  */
  nextJob = schedule.scheduleJob(`0 0 */${config.frequency} * * *`, () => {
    processAll();
  });

  if (nextJob) {
    console.log(`Next run scheduled for ${nextJob.nextInvocation().toString()}`);
  } else {
    throw new Error('Failed to schedule next Job (nextjob == false).');
  }
});
