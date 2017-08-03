/* eslint-disable no-undef */

const mozjpeg = require('mozjpeg-stream');
const multipipe = require('multipipe');
const phantomjs = require('phantomjs-prebuilt');
const webshot = require('webshot');

const defaultOptions = require('../config/webshot.json');

// Returns a stream of the screenshot at url
function createScreenshotStream (site, force) {
  var options = Object.assign({}, defaultOptions);

  // Use phantomjs v2.x from the -prebuilt package
  options.phantomPath = phantomjs.path;

  if (site.webshotOptions) {
    options = Object.assign(options, site.webshotOptions);
  }

  if (site.userAgent) {
    options.userAgent = site.userAgent;
  }

  /* If we're forcing a screenshot, don't wait for the page to load. Instead,
     just wait as long as we can before timeout and snap it anyway. t-5s
     from timeout, just to account for (hopefully) init time and such.

     Also see https://github.com/brenden/node-webshot#phantom-callbacks
     */
  if (site.snapFn && force) {
    options.takeShotOnCallback = true;
    options.onLoadFinished = {
      fn: site.snapFn,
      context: { forceAfter: 30000 }
    };
  }

  /* If we are NOT forcing a screenshot, wait for the site to load and optional
     pre-snap tasks to finish, then make the snap.
     */
  else if (site.snapFn) {
    options.takeShotOnCallback = true;
    options.onLoadFinished = {
      fn: site.snapFn,
      context: { forceAfter: 30000 }
    };
  }

  // TODO: I believe takeShotOnCallback stomps on CSS settings and such...
  else if (force) {
    options.takeShotOnCallback = true;
    options.onLoadStarted = function () {
      setTimeout(function() {
        window.callPhantom('takeShot');
      }, 30000);
    };
  }

  return multipipe(webshot(site.url, options), mozjpeg({quality: 60}));
}

module.exports = {
  stream: createScreenshotStream
}
