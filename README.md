# Red Feed / Blue Feed

Web service for aggregating, archiving and comparing headlines from major new
websites.


## How Sites Were Chosen

At the moment, it's mostly a collection of major new sites that I'm aware of.
There's not a science behind the method. Anyone who can point to a good
empirical way to choose the sites included will get a cookie.

There are also a few sites that should be here (probably), but that have issues
with rendering mobile websites with the simple node-webshot + PhantomJS combo
I hacked together. They are:

- Huffington Post (wants to be all wide and weird)
- Drudge Report (doesnt' appear to have a mobile site at all AFAIK?)


## Political Bias Rankings

For now, I've just used the rankings at [All Sides](http://allsides.com), which
does some great work in the same space. It's as close to an authoritative source
for this data as I could find. Again, if you have a better one, let me know.

The scale I've used is from -2 (very liberal) to 2 (very conservative), based
on the AllSides ranking system. Ostensibly, 0 is neutral and unbiased.The
rankings are written to the manifest for each collection of snapshots, so
we can reflect the bias of that source at that moment in time.


## Future To-Do

This was a fun weekend hackathon project for me, but there are a number of ways
this can improve and grow if there's enough interest. Off the top of my head:

- Snap the entire site, rather than just the first N vertical pixels. Chop these
  up into tiles on the backend, and have the client piece them together if
  they're needed. For now, some sites are REALLY tall (i.e. Breitbart), and I
  don't want each page load to include 40 MB of jpegs just to load a 40k pixel
  tall snap, nor do I want to pay for hosting or bandwidth for them.

- Store the rendered DOM as well, for later processing (i.e. extracting headlines
  as text). Lots of good reasons to do this, not the least of which is making
  the headlines searchable.

- Make the archiver service less hack-y / more distributed & robust.

- Fix issues with individual sites missing chunks of images, not wanting to
  format correctly, etc.

- Strip ads from pages before saving, perhaps with some customized per-site JS
  to just remove the offending DOM elements. Possible legal issues. I dunno.


## Building, Running, Development, etc.

Mostly notes to my future self, but if you're here to contribute (Hello! and
thanks!), this info will come in handy.

### Google Cloud Storage Authentication

Needs a gcs.json file with the auth goodies from Google. Put it in
`archiver/config/gcs.json` - this is excluded from the repo for obvious reasons.
See also code in `archiver/google-cloud.json` and [Google's docs](https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/1.2.0/guides/authentication).

### Cross-Origin Stuff

Have to set CORS policy on the destination bucket, else the Javascript on the
website won't be able to grab the necessary manifests. Set via

`gsutil cors set cors.json gs://redfeedbluefeed-snaps-mobile-2017`

with the included `cors.json` file (tweak as needed)

### Single-site archiving (mostly for testing)

Just pass the short names of the sites you want to archive on the command line.
This will archive ONLY those sites, and skip the recurring scheduling

`node archiver/src/index.js cnn foxnews thehill`
