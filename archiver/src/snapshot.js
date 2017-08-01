const mozjpeg = require('mozjpeg-stream');
const multipipe = require('multipipe');
const webshot = require('webshot');
const webshotOptions = require('../config/webshot.json');

// Returns a stream of the screenshot at url
function createScreenshotStream (site) {
  var options = Object.assign({}, webshotOptions);
  if (site.userAgent) {
    options.userAgent = site.userAgent;
  }
  return multipipe(webshot(site.url, options), mozjpeg({quality: 50}));
}

module.exports = {
  stream: createScreenshotStream
}
