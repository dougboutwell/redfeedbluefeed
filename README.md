# Red Feed / Blue Feed

Web service for aggregating, archiving and comparing headlines from major new
websites.


## Cross-Origin Stuff

Have to set CORS policy on the destination bucket or local development won't
work (and possibly production deployments too). Set via

`gsutil cors set cors.json gs://redfeedbluefeed-snaps-mobile-2017`

with cors.json (tweak as needed)
