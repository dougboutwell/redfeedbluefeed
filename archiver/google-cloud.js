const config = require('./config.json');
const gcs = require('@google-cloud/storage')(config.gcs);


async function writeFile (src, dst) {
  const bucket = gcs.bucket(config.gcs.bucketName);

  bucket.upload(src, {
    public: true,
    destination: dst
  }, (err, file, apiResponse) => {
    if (err) {
      console.log(err, file, apiResponse);
      throw err;
    }
  });
}

function streamFile(destPath) {
  const bucket = gcs.bucket(config.gcs.bucketName);
  const file = bucket.file(destPath);
  return file.createWriteStream({
    public: true,
    metadata: {
      cacheControl: "public, immutable, max-age=315360000"
    }
  })
}

module.exports = {
  writeFile,
  streamFile
};