const config = require('./config.json');
const gcs = require('@google-cloud/storage')(config.gcs);

const gcsOptions = {
  public: true,
  metadata: {
    cacheControl: "public, immutable, max-age=315360000"
  }
};

async function writeFile (src, dst) {
  const bucket = gcs.bucket(config.gcs.bucketName);
  const options = Object.assign({ destination: dst }, gcsOptions);
  bucket.upload(src, options, (err, file, apiResponse) => {
    if (err) {
      console.log(err, file, apiResponse);
      throw err;
    }
  });
}

async function streamFile (destPath) {
  const bucket = gcs.bucket(config.gcs.bucketName);
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
  const stream = await streamFile(dstPath);
  return new Promise ((resolve, reject) => {
    const manifest = stream
      .on('error', (err) => reject(err))
      .on('finish', () => resolve());
    manifest.write(JSON.stringify(data, null, 2)); // pretty-print with 2 spaces
    manifest.end();
  });
}

module.exports = {
  writeFile,
  streamFile,
  writeJSON
};
