const webshot = require('webshot');
const moment = require('moment');
const { join } = require('path');
const mozjpeg = require('mozjpeg-stream');
const { streamFile, writeJSON } = require('./google-cloud');
const schedule = require('node-schedule');

const webshotOptions = require('../config/webshot.json');

// TODO: Validate this against the expected schema.
var sites = require('../config/sites.json');


// Returns a stream of the screenshot at url
function streamScreenshot(site) {
  var options = Object.assign({}, webshotOptions);
  if (site.userAgent) {
    options.userAgent = site.userAgent;
  }
  return webshot(site.url, webshotOptions);
}

// Wrap the streaming snapshot + GCS write into a promise
async function processSite (site) {
  const destStream = await streamFile(site.filePath);
  return new Promise((resolve, reject) => {
    const stream = streamScreenshot(site)
      .on('error', (err) => reject(err));
    stream.pipe(mozjpeg({quality: 50}))
      .on('error', (err) => reject(err))
      .pipe(destStream)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err));
  });
}

// Global vars
// TODO: "recurring" is just a placeholder for "testing" - in that case we
// shouldn't write the manifest, and should write it to a local file.
// In fact, it's kinda a different thing altogether....
var recurring = true;
var nextJob;

// if any sites are passed along on the command line, extract those and filter
// the sites list
const requestedSites = process.argv.slice(2);
if (requestedSites.length > 0) {
  sites = sites.filter(site => requestedSites.includes(site.shortName));
  recurring = false
}

async function processAll () {
  const now = moment().utc();
  console.log(`Starting site archive for ${now.toString()}`);

  // Timestmap for use in file / folder names
  const ts = now.format('YYYY-MM-DD_HH');
  const dstFolder = ts;

  var manifestData = {
    basePath: dstFolder,
    timestamp: now.toISOString(),
    sites: []
  };

  // Process each site
  for (const i in sites) {
    const site = sites[i];
    try {
      console.log(site.name);
      site.filePath = join(dstFolder, `${ts}-${site.shortName}.jpg`);
      await processSite(site);
      manifestData.sites.push(site);
    } catch (e) {
      console.log(`ERROR: could not process ${site.name} - ${e.message}`);
    }
  }

  // Write manifests
  const manifestPath = join(dstFolder, 'manifest.json');
  const latestPath = 'latest.json';
  try {
    console.log('manifest.json');
    await writeJSON(manifestPath, manifestData);
    console.log('latest.json');
    await writeJSON(latestPath, manifestData);
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
  if (recurring) {
    nextJob = schedule.scheduleJob('0 */5 * * * *', () => {
      processAll();
    });
  }

  if (nextJob) {
    console.log(`Next run scheduled for ${nextJob.nextInvocation().toString()}`);
  } else if (recurring) {
    throw new Error('Failed to schedule next Job (nextjob == false).');
  }
});
