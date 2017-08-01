const mozjpeg = require('mozjpeg-stream');
const multipipe = require('multipipe');
const phantomjs = require('phantomjs-prebuilt');
const webshot = require('webshot');

var options = require('../config/webshot.json');

options.phantomPath = phantomjs.path;

// Returns a stream of the screenshot at url
function createScreenshotStream (site) {
  if (site.webshotOptions) {
    options = Object.assign(options, site.webshotOptions);
  }
  if (site.userAgent) {
    options.userAgent = site.userAgent;
  }

  return multipipe(webshot(site.url, options), mozjpeg({quality: 50}));
}

module.exports = {
  stream: createScreenshotStream
}
