# Red Feed / Blue Feed

Web service for aggregating, archiving and comparing headlines from major new
websites.

## Google Cloud Storage Authentication

Needs a gcs.json file with the auth goodies from Google. Put it in
`archiver/config/gcs.json` - this is excluded from the repo for obvious reasons.
See also code in `archiver/google-cloud.json` and [Google's docs](https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/1.2.0/guides/authentication).

## Cross-Origin Stuff

Have to set CORS policy on the destination bucket or local development won't
work (and possibly production deployments too). Set via

`gsutil cors set cors.json gs://redfeedbluefeed-snaps-mobile-2017`

with cors.json (tweak as needed)
