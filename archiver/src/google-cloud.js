const config = require('../config/google-cloud.json');
const gcs = require('@google-cloud/storage')(config);

// singleton bucket object - init once.
const bucket = gcs.bucket(config.bucketName);

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

async function deleteFile (file) {
  return file.delete();
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
  stream: createGCSStream,
  writeJSON
};
