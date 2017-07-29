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

function streamFile(destPath) {
  const bucket = gcs.bucket(config.gcs.bucketName);
  const file = bucket.file(destPath);
  return file.createWriteStream(gcsOptions);
}

module.exports = {
  writeFile,
  streamFile
};
