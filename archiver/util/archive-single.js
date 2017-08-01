const fs = require('fs');
const { join } = require('path');
const mkdirp = require('mkdirp');

const snap = require('../src/snapshot');
const sites = require('../config/sites');

if (process.argv.length < 3) {
  console.log('Must specify at least one site on the command line');
  process.exit(2);
}

// Grab requested site from command line
const requestedSite = process.argv[2];
const site = sites.filter(site => requestedSite.includes(site.shortName))[0];
if (!site) {
  console.log(`No known sites match ${requestedSite}`);
  process.exit(1);
}

const outDir = join(process.env.HOME, 'Desktop', 'redfeedbluefeed-tests');
mkdirp.sync(outDir);
const outPath = join(outDir, `${site.shortName}.jpg`);
const destStream = fs.createWriteStream(outPath);
console.log(`Generating snapshot of ${site.name} at ${outPath}`);
snap.stream(site).pipe(destStream);
