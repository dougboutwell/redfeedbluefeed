const moment = require('moment');
const config = require('config');
const gcs = require('@google-cloud/storage')(config.get('gcs'));

// singleton bucket object - init once.
const bucket = gcs.bucket(config.get('gcs.bucketName'));

const gcsOptions = {
  public: true,
  // Not all files should be cached (in particular, latest.json)
  // metadata: {
  //   cacheControl: "public, immutable, max-age=315360000"
  // }
  metadata: {
    cacheControl: 'max-age=0, no-cache, no-store'
  }
};

// create a writable stream for a file at destPath
async function createGCSStream (destPath) {
  const file = bucket.file(destPath);
  if (await fileExists(file)) {
    await deleteFile(file);
  }

  return new Promise (resolve => {
    const stream = file.createWriteStream(gcsOptions);
    resolve(stream);
  });
}

// async wrapper for gcs file.exists
async function fileExists (file) {
  // https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/1.2.0/storage/bucket?method=exists
  return file.exists().then((data) => {
    return data[0];
  })
}

// get list of the available screenshot folders
async function folderList () {
  return bucket.getFiles({
    // TODO: changing frequency may break this?
    maxResults: 365 * 24 / config.get('archiver.frequency'),
    delimiter: '/',
  }).then((data) => {
    const response = data[2];
    return response.prefixes.map(val => val.replace(/\//, ''));
  });
}

// fetch a file from the current bucket
async function readFile (fileName, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    var data = '';
    bucket.file(fileName).createReadStream()
      .setEncoding(encoding)
      .on('data', chunk => data += chunk)
      .on('error', err => reject(err))
      .on('end', () => resolve(data));
  });
}

// generate a fresh catalog.json file
async function generateCatalog (options = {writeFile: true}) {
  var data = {};
  data.timeStamp = moment().utc().toISOString();
  data.folderNames = await folderList();

  if (options.writeFile) {
    const fileName = config.get('archiver.fileNames.catalog');
    await writeJSON(fileName, data);
  }
  return data;
}

// add one name to folderNames in catalog.json + update timestamp
async function addToCatalog (folderName) {
  const fileName = config.get('archiver.fileNames.catalog');
  var data;
  try {
    data = JSON.parse(await readFile(fileName));
    if (!data.folderNames || data.folderNames.length < 1) {
      throw new Error('folderNames array is empty')
    }
  } catch (err) {
    console.log(`ERROR: could not read existing catalog. Regenerating (${err})`);
    data = await generateCatalog({writeFile: false});
  }
  data.timeStamp = moment().utc().toISOString();
  if (!data.folderNames.includes(folderName)) {
    data.folderNames.push(folderName);
  }

  await writeJSON(fileName, data);
}

// delete a file
async function deleteFile (file) {
  return file.delete();
}

// fetch file metadata
async function getMetadata (destPath) {
  const file = bucket.file(destPath);
  return file.getMetadata();
}

// Writes json data object to a file on GCS at dstPath
async function writeJSON (dstPath, data) {
  const stream = await createGCSStream(dstPath);
  return new Promise ((resolve, reject) => {
    const manifest = stream
      .on('error', (err) => reject(err))
      .on('finish', () => resolve());
    manifest.write(JSON.stringify(data, null, 2)); // pretty-print with 2 spaces
    manifest.end();
  });
}

module.exports = {
  addToCatalog,
  stream: createGCSStream,
  metadata: getMetadata,
  writeJSON,
};
