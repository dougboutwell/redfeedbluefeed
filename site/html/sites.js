var baseURL = 'http://storage.googleapis.com/redfeedbluefeed-snaps-mobile-2017/';
var latestURL = baseURL + 'latest.json';

const biasClasses = {
  '-2': 'bias-1',
  '-1': 'bias-2',
  '0':  'bias-3',
  '1':  'bias-4',
  '2':  'bias-5'
};

// Scroll horizontally to center the element referenced by sel in containerSel
function centerInViewport(sel, containerSel) {
  var el = $(sel);
  var container = $(containerSel);
  var dx = container.width() - el.width()
  var x = el.offset().left - (dx / 2);
  container.scrollLeft(x);
}

$.ajax(latestURL, {cache: false})
  .done(function (data) {
    data = JSON.parse(data);
    var timestamp = moment(data.timestamp);

    $('.timestamp').html(timestamp.format('LLLL'));

    var sites = data.sites.sort(function (a, b) {
      if (a.bias < b.bias) { return -1; }
      else if (a.bias > b.bias) { return 1; }
      else { return 0; }
    });

    for (var i in sites) {
      var site = sites[i];
      var imgURL = baseURL + site.filePath;
      var bias = biasClasses[site.bias] || 'bias-3';
      console.log(bias);
      $('.sites').append(' \
      <li class="site">\
        <a href="' + site.url + '" title="' + site.name + '" target="_blank">\
          <div class="siteTitle ' + bias + '">' + site.name + '</div>\
        </a>\
        <img src=' + imgURL + ' class="siteImage"> \
      </li> \
      ');
    }

    centerInViewport('.site:nth-child(' + Math.floor(sites.length / 2) + ')', '.scrollContainer');
  });
