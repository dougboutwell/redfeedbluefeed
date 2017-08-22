const fs = require('fs');
const { join } = require('path');
const mkdirp = require('mkdirp');

const snap = require('../src/snapshot');
const allSites = require('../src/sites');

// Grab requested site from command line
const requestedSiteNames = process.argv.slice(2);
var sites = [];
if (requestedSiteNames.length > 0) {
  sites = allSites.filter(site => requestedSiteNames.includes(site.shortName));
  if (sites.length < 1) {
    console.log(`No known sites match ${requestedSiteNames}`);
    process.exit(1);
  }
} else {
  sites = allSites;
}

async function archiveOne(site) {
  return new Promise((resolve, reject) => {
    const outDir = join(process.env.HOME, 'Desktop', 'redfeedbluefeed-tests');
    mkdirp.sync(outDir);
    const outPath = join(outDir, `${site.shortName}.jpg`);
    const destStream = fs.createWriteStream(outPath);
    console.log(`${site.name} => ${outPath}`);
    snap.stream(site, false)
      .on('error', (err) => reject(err))
      .pipe(destStream)
      .on('error', (err) => reject(err))
      .on('finish', () => resolve());
  });
}

async function archiveAll(sites) {
  for (const i in sites) {
    const s = sites[i];
    try {
      await archiveOne(s);
    } catch (e) {
      console.log(`ERROR: Could not archive ${s.name} - ${e.message}`);
    }
  }
}

archiveAll(sites);
