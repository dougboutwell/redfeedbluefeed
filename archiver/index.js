const webshot = require('webshot');
const moment = require('moment');
const { join } = require('path');
const mozjpeg = require('mozjpeg-stream');
const { streamFile } = require('./google-cloud');

var sites = [
  {
    name: 'CNN',
    url: 'http://cnn.com',
    shortName: 'cnn'
  }, {
    name: 'Fox News',
    url: 'http://foxnews.com',
    shortName: 'foxnews'
  }, {
    name: 'Wall Street Journal',
    url: 'http://wsj.com',
    shortName: 'wsj'
  }, {
    name: 'Washington Post',
    url: 'http://washingtonpost.com',
    shortName: 'washingtonpost'
  }, {
    name: 'NY Times',
    url: 'http://nytimes.com',
    shortName: 'nytimes'
  }, {
    name: 'Red State',
    url: 'http://redstate.com',
    shortName: 'redstate'
  }, {
    name: 'Breitbart',
    url: 'http://breitbart.com',
    shortName: 'breitbart'
  }, {
    name: 'Huffington Post',
    url: 'http://huffingtonpost.com',
    shortName: 'huffingtonpost'
  }, {
    name: 'USA Today',
    url: 'http://usatoday.com',
    shortName: 'usatoday'
  }, {
    name: 'Politico',
    url: 'http://politico.com',
    shortName: 'politico'
  }, {
    name: 'The Hill',
    url: 'http://thehill.com',
    shortName: 'thehill'
  }, {
    name: 'MSNBC',
    url: 'http://msnbc.com',
    shortName: 'msnbc'
  }
];

const options = {
  screenSize: {
    width: 375,
    height: 667
  },
  shotSize: {
    width: 'all',
    height: '2000'
  },
  quality: 100,
  defaultWhiteBackground: true,
  streamType: 'jpg',
  timeout: 180 * 1000,
  userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

// function takeScreenshot(site) {
//   return function (cb) {
//     console.log(site.name);
//     webshot(site.url, join(outputPath, site.shortName + '.jpg'), options, cb);
//   };
// }

// Returns a stream of the screenshot at url
function streamScreenshot(url) {
  return webshot(url, options);
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
