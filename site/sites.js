var baseURL = 'http://storage.googleapis.com/redfeedbluefeed-snaps-mobile-2017/';
var latestURL = baseURL + 'latest.json';

const biasClasses = {
  '-2': 'bias-1',
  '-1': 'bias-2',
  '0':  'bias-3',
  '1':  'bias-4',
  '2':  'bias-5'
};

$.ajax(latestURL, {cache: false})
  .done(function (data) {
    data = JSON.parse(data);
    console.log(data);

    var timestamp = moment(data.timestamp);

    $('.timestamp').html(timestamp.toString());

    for (var i in data.sites) {
      var site = data.sites[i];
      var imgURL = baseURL + site.filePath;
      var bias = biasClasses[site.bias] || 'bias-3';
      console.log(bias);
      $('.sites').append(' \
      <li class="site">\
        <div class="siteTitle ' + bias + '">' + site.name + '</div>\
        <img src=' + imgURL + ' class="siteImage"> \
      </li> \
      ');
    }
  });
