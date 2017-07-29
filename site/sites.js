var baseURL = 'http://storage.googleapis.com/redfeedbluefeed-snaps-mobile-2017/';
var latestURL = baseURL + 'latest.json';

$.ajax(latestURL)
  .done(function (data) {
    data = JSON.parse(data);
    console.log(data);

    for (var i in data.sites) {
      var imgURL = baseURL + data.sites[i].filePath;
      $('.sites').append(' \
      <li class="site"> \
        <img src=' + imgURL + ' class="siteImage"> \
      </li> \
      ');
    }
  });
