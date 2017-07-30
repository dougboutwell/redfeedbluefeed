const webshot = require('webshot');
const moment = require('moment');
const { join } = require('path');
const mozjpeg = require('mozjpeg-stream');
const { streamFile, writeJSON } = require('./google-cloud');
const schedule = require('node-schedule');

const webshotOptions = require('../config/webshot.json');
var sites = require('../config/sites.json');

// Returns a stream of the screenshot at url
function streamScreenshot(url) {
  return webshot(url, webshotOptions);
}

// Wrap the streaming snapshot + GCS write into a promise
async function processSite (site) {
  const destStream = await streamFile(site.filePath);
  return new Promise((resolve, reject) => {
    const stream = streamScreenshot(site.url);
    stream.pipe(mozjpeg({quality: 50}))
      .pipe(destStream)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err));
  });
}

async function processAll () {
  const now = moment().utc();
  // Timestmap for use in file / folder names
  const ts = now.format('YYYY-MM-DD_hh');
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
    await writeJSON(manifestPath, manifestData);
    await writeJSON(latestPath, manifestData);
  } catch (e) {
    console.log(`ERROR: could not write manifest to ${manifestPath} - ${e.message}`)
  }
}

// Always run on startup...
processAll();

// ... then schedule to run every hour
schedule.scheduleJob('0 0 * * * *', () => {
  processAll();
});
