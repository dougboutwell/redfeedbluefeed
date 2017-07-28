const webshot = require('webshot');
const moment = require('moment');
const { join } = require('path');
const { series } = require('async');

const { writeFile, streamFile } = require('./google-cloud');

const dstFolder = moment().format('YYYY/MM/DD/hh/mm/');

const sites = [
  {
    name: 'CNN',
    url: 'http://cnn.com',
    outFile: 'cnn'
  }, {
    name: 'Fox News',
    url: 'http://foxnews.com',
    outFile: 'foxnews'
  }, {
    name: 'Wall Street Journal',
    url: 'http://wsj.com',
    outFile: 'wsj'
  }, {
    name: 'Washington Post',
    url: 'http://washingtonpost.com',
    outFile: 'washingtonpost'
  }, {
    name: 'NY Times',
    url: 'http://nytimes.com',
    outFile: 'nytimes'
  }, {
    name: 'Red State',
    url: 'http://redstate.com',
    outFile: 'redstate'
  }, {
    name: 'Breitbart',
    url: 'http://breitbart.com',
    outFile: 'breitbart'
  }, {
    name: 'Huffington Post',
    url: 'http://huffingtonpost.com',
    outFile: 'huffingtonpost'
  }, {
    name: 'USA Today',
    url: 'http://usatoday.com',
    outFile: 'usatoday'
  }, {
    name: 'Politico',
    url: 'http://politico.com',
    outFile: 'politico'
  }, {
    name: 'The Hill',
    url: 'http://thehill.com',
    outFile: 'thehill'
  }, {
    name: 'MSNBC',
    url: 'http://msnbc.com',
    outFile: 'msnbc'
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
  quality: 50,
  defaultWhiteBackground: true,
  streamType: 'jpg',
  timeout: 60 * 1000,
  userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

function takeScreenshot(site) {
  return function (cb) {
    console.log(site.name);
    webshot(site.url, join(outputPath, site.outFile + '.jpg'), options, cb);
  };
}

function streamScreenshot(site) {
  console.log(site.name);
  return webshot(site.url, options);
}

console.log('Beginning Screenshots...');

for (const i in sites) {
  const site = sites[i];
  const destPath = join(dstFolder, site.outFile + '.jpg');
  const stream = streamScreenshot(site);
  stream.pipe(streamFile(destPath));
  break;
}

// series(sites.map(takeScreenshot));
