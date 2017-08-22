var rfbf = {
  baseURL: 'http://storage.googleapis.com/redfeedbluefeed-snaps-mobile-2017/',
  biasClasses: {
    '-2': 'bias-1',
    '-1': 'bias-2',
    '0':  'bias-3',
    '1':  'bias-4',
    '2':  'bias-5'
  },
  latestFileName: 'latest.json',
  catalogFileName: 'catalog.json',
  manifestFileName: 'manifest.json',
  currentFolder: '',
  pickerSel: '#datetimepicker'
}

if (/localhost/.test(location.hostname)) {
  rfbf.baseURL = 'http://storage.googleapis.com/redfeedbluefeed-snaps-mobile-staging/';
}

// Scroll horizontally to center the element referenced by sel in containerSel
function centerInViewport(sel, containerSel) {
  var el = $(sel);
  var container = $(containerSel);
  var dx = container.width() - el.width()
  var x = el.offset().left - (dx / 2);
  container.scrollLeft(x);
}

function updateImages(folderName) {
  // Don't update if we don't need to.
  if (rfbf.currentFolder === folderName) {
    return;
  }
  rfbf.currentFolder = folderName;

  var manifestURL;
  if (!folderName || folderName ==='') {
    manifestURL = rfbf.baseURL + rfbf.latestFileName;
  } else {
    manifestURL = rfbf.baseURL + folderName + '/' + rfbf.manifestFileName;
  }

  // Fetch the manifest and parse it
  $.ajax(manifestURL, {cache: false})
    .done(function (data) {
      data = JSON.parse(data);
      var timestamp = moment(data.timestamp);

      $('.timestamp').html(timestamp.format('LLLL'));

      // Sort according to bias and save to local data
      rfbf.sites = data.sites.sort(function (a, b) {
        if (a.bias < b.bias) { return -1; }
        else if (a.bias > b.bias) { return 1; }
        else { return 0; }
      });

      // Insert them into the DOM
      $('.sites').empty();
      for (var i in rfbf.sites) {
        var site = rfbf.sites[i];
        var imgURL = rfbf.baseURL + site.filePath;
        var bias = rfbf.biasClasses[site.bias] || 'bias-3';
        $('.sites').append(' \
        <li class="site">\
          <a href="' + site.url + '" title="' + site.name + '" target="_blank">\
            <div class="siteTitle ' + bias + '">' + site.name + '</div>\
          </a>\
          <img src=' + imgURL + ' class="siteImage"> \
        </li> \
        ');
      }

      centerInViewport('.site:nth-child(' + Math.floor(rfbf.sites.length / 2) + ')', '.scrollContainer');
    }
  );
}


function updateCatalog () {
  var catalogURL = rfbf.baseURL + rfbf.catalogFileName;
  $.ajax(catalogURL, {cache: false})
    .done(function (data) {
      data = JSON.parse(data);

      rfbf.availableDates = [];
      for (var i = 0; i < data.folderNames.length; i++) {
        var folderName = data.folderNames[i];
        var pieces = folderName.split('_');
        var folderDate = moment(pieces[0]);
        folderDate.hour(pieces[1]);
        folderDate.local();
        rfbf.availableDates.push(folderDate);
      }
      rfbf.minDate = moment.min(rfbf.availableDates);
      rfbf.maxDate = moment.max(rfbf.availableDates);

      var picker = $(rfbf.pickerSel);
      picker.datetimepicker({
        startDate: rfbf.minDate.format('YYYY/MM/DD'),
        yearStart: rfbf.minDate.year(),
        minDate: rfbf.minDate.format('YYYY/MM/DD'),
        maxDate: 0,
        theme: 'dark',
        // step: 120,
        // TODO: we shouldn't bake allowed times into the client.
        allowTimes:[
          '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
          '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
        ],
        onChangeDateTime: function (dp,$input) {
          // This value comes back as a string in the format specified by the picker
          // default 'Y/m/d H:i'
          // See https://xdsoft.net/jqplugins/datetimepicker/#format
          var val = $input.val();

          // Parse this to a moment
          var requestedDate = moment(val, 'YYYY/MM/DD HH:mm');

          // Find the closest available date to the date requested
          var closestDate;
          var dClosest = Number.MAX_VALUE;

          for (var i = 0; i < rfbf.availableDates.length; i++) {
            var candidate = rfbf.availableDates[i];
            dCandidate = Math.abs(candidate.unix() - requestedDate.unix());
            if (dCandidate < dClosest) {
              closestDate = candidate;
              dClosest = dCandidate;
            }
          }

          // Tag the mathced date as local time, then convert back to UTC
          // Server folders are UTC, but we convert times to local for display
          // in the client
          closestDate.utcOffset(moment().utcOffset());
          closestDate.utc();
          var folderName = closestDate.format('YYYY-MM-DD_HH')

          updateImages(folderName);
        },
      });

      rfbf.showingCalendar = false;

      $('#calendar').click(function(){
        if (rfbf.showingCalendar) {
          $('#datetimepicker').datetimepicker('hide');
          rfbf.showingCalendar = false;
        } else {
          $('#datetimepicker').datetimepicker('show');
          rfbf.showingCalendar = true;
        }
      });
    }
  );
}

function initDateTimePicker () {
}

initDateTimePicker();
updateCatalog();
updateImages();
