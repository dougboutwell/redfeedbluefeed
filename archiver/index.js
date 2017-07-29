const webshot = require('webshot');
const moment = require('moment');
const { join } = require('path');
const mozjpeg = require('mozjpeg-stream');
const { streamFile } = require('./google-cloud');

const config = require('./config.json');

// Returns a stream of the screenshot at url
function streamScreenshot(url) {
  return webshot(url, config.options);
}

// Wrap the streaming snapshot + GCS write into a promise
function processSite (site) {
  return new Promise((resolve, reject) => {
    const stream = streamScreenshot(site.url);
    stream.pipe(mozjpeg({quality: 50}))
      .pipe(streamFile(site.filePath))
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

  for (const i in config.sites) {
    const site = config.sites[i];
    try {
      console.log(site.name);
      site.filePath = join(dstFolder, `${ts}-${site.shortName}.jpg`);
      await processSite(site);
      manifestData.sites.push(site);
    } catch (e) {
      console.log(`ERROR: could not process ${site.name} - ${e.message}`);
    }
  }

  const manifestPath = join(dstFolder, 'manifest.json');

  try{
    const manifest = streamFile(manifestPath);
    manifest.write(JSON.stringify(manifestData));
    manifest.end();
  } catch (e) {
    console.log(`ERROR: could not write manifest to ${manifestPath} - ${e.message}`)
  }
}

processAll();
