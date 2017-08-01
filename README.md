# Red Feed / Blue Feed

Web service for aggregating, archiving and comparing headlines from major new
websites.

[redfeedbluefeed.com](http://redfeedbluefeed.com)

This was a fun weekend hackathon project for me, but there are a number of ways
this can improve and grow if there's enough interest. See GitHub Issues for
To-Dos and notes to future self.


## How Sites Were Chosen

At the moment, it's mostly a collection of major new sites that I'm aware of.
There's not a science behind the method. Anyone who can point to a good
empirical way to choose the sites included will get a cookie.


## Political Bias Rankings

For now, I've just used the rankings at [All Sides](http://allsides.com), which
does some great work in the same space. It's as close to an authoritative source
for this data as I could find. Again, if you have a better one, let me know.

The scale I've used is from -2 (very liberal) to 2 (very conservative), based
on the AllSides ranking system. Ostensibly, 0 is neutral and unbiased.The
rankings are written to the manifest for each collection of snapshots, so
we can reflect the bias of that source at that moment in time.


## Building, Running, Development, etc.

Mostly notes to my future self, but if you're here to contribute (Hello! and
thanks!), this info will come in handy.

### Google Cloud Storage Authentication

Needs a gcs.json file with the auth goodies from Google. Put it in
`archiver/config/gcs.json` - this is excluded from the repo for obvious reasons.
See also code in `archiver/google-cloud.json` and [Google's docs](https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/1.2.0/guides/authentication).

### Cross-Origin Stuff

Have to set CORS policy on the destination bucket, else the Javascript on the
website won't be able to grab the necessary manifests. If you make a new bucket,
set CORS on it via

`gsutil cors set cors.json gs://redfeedbluefeed-snaps-mobile-2017`

with the included `cors.json` file (tweak as needed). This possibly only applies
to production / local development. I dunno.

### Single-site archiving (mostly for testing)

`node archiver/util/archive-single.js foxnews`

Pass the short name of the site you want to archive as the script's single argument.
