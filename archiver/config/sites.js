/* eslint-disable no-undef */

const sites = [
  {
    name: "Daily Kos",
    url: "http://dailykos.com",
    shortName: "dailykos",
    bias: -2,
    webshotOptions: {
      takeShotOnCallback: true,
      onLoadFinished: function () {
        function removeAllWithSelector (sel) {
          var ads = document.querySelectorAll(sel);

          for (var i = 0; i < ads.length; i++) {
            var ad = ads[i];
            ad.parentElement.removeChild(ad);
          }
        }

        function removeAds () {
          removeAllWithSelector('[id^="google_ads"]');
          removeAllWithSelector('.mobile-ad');
        }

        function dkLoadToHeight(height, cb) {
          removeAds();

          var stories = document.querySelectorAll('.story');
          var yMax = 0;
          for (var s in stories) {
            var story = stories[s];
            if (typeof story !== 'object') continue;
            var yStory = story.getBoundingClientRect().bottom;
            if (yStory > yMax) {
              yMax = yStory;
            }
          }

          if (yMax < height) {
            console.log('current page height: ' + yMax + ' - loading...');
            BlogApp.Views.storyView.collection.loadStories();
            setTimeout(function () {
              dkLoadToHeight(height);
            }, 2000);
          } else {
            cb();
            console.log('current page height: ' + yMax + ' - Finished');
          }
        }

        // Load 4000px of articles, then
        dkLoadToHeight(4000, function () {
          window.callPhantom('takeShot');
        });
      },
      customCSS: '.mobile-ad, .mobile-petition-ad { display: none !important; }'
    }
  }, {
    name: "Huffington Post",
    url: "http://m.huffpost.com",
    shortName: "huffingtonpost",
    bias: -2
  }, {
    name: "Raw Story",
    url: "http://rawstory.com",
    shortName: "rawstory",
    bias: -2,
    webshotOptions: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
      takeShotOnCallback: true,
      onLoadFinished: function () {
        function removeAllWithSelector (sel) {
          var ads = document.querySelectorAll(sel);

          for (var i = 0; i < ads.length; i++) {
            var ad = ads[i];
            ad.parentElement.removeChild(ad);
          }
        }

        function removeAds () {
          removeAllWithSelector('.advertisement');
          removeAllWithSelector('.footer-outer-wrapper');
        }

        // window.scrollTo(0, 4000);
        setTimeout(function () {
          removeAds();
          window.callPhantom('takeShot');
        }, 500);
      }
    }
  }, {
    name: "MSNBC",
    url: "http://msnbc.com",
    shortName: "msnbc",
    bias: -2,
    webshotOptions: {
      customCSS: '[id^="google_ads"] { display: none !important }'
    }
  }, {
    name: "Washington Post",
    url: "http://washingtonpost.com",
    shortName: "wapo",
    bias: -1
  }, {
    name: "NY Times",
    url: "http://nytimes.com",
    shortName: "nytimes",
    bias: -1,
    webshotOptions: {
      onLoadFinished: function () {
        // Remove multimedia / audio stuff. Thankfully NYTimes has jQuery
        $('.sfg-li:has(iframe)').remove();

        function removeAllWithSelector (sel) {
          var ads = document.querySelectorAll(sel);

          for (var i = 0; i < ads.length; i++) {
            var ad = ads[i];
            ad.parentElement.removeChild(ad);
          }
        }

        // Remove useless "Daily Briefing"
        removeAllWithSelector('.sfg-li-briefing');

        // Remove ads
        removeAllWithSelector('.ad');
      },
    }
  }, {
    name: "Reuters",
    url: "http://reuters.com",
    shortName: "reuters",
    bias: 0,
    webshotOptions: {
      customCSS: '.mpu_ad { display: none !important }'
    }
  }, {
    name: "USA Today",
    url: "http://usatoday.com",
    shortName: "usatoday",
    bias: 0,
    webshotOptions: {
      customCSS: '.ad { display: none !important }'
    }
  }, {
    name: "Politico",
    url: "http://politico.com",
    shortName: "politico",
    bias: 0,
    webshotOptions: {
      onLoadFinished: function () {
        // Remove ads
        $('.super:has(.ad)').remove();
      },
      customCSS: '.global-announce, .super-header { display: none !important; }',
    }
  }, {
    name: "The Hill",
    url: "http://thehill.com",
    shortName: "thehill",
    bias: 0,
    webshotOptions: {
      customCSS: '.OUTBRAIN, .block-dfp { display: none !important; }',
    }
  }, {
    name: "CNN",
    url: "http://cnn.com",
    shortName: "cnn",
    bias: 0
  }, {
    name: "Wall Street Journal",
    url: "http://wsj.com",
    shortName: "wsj",
    bias: 0,
    webshotOptions: {
      customCSS: '.wsj-ad { display: none !important; }',
    }
  }, {
    name: "Associated Press",
    url: "http://apnews.com",
    shortName: "ap",
    bias: 0
  }, {
    name: "BBC News",
    url: "http://bbc.com/news/",
    shortName: "bbc",
    bias: 0
  }, {
    name: "The Daily Caller",
    url: "http://dailycaller.com",
    shortName: "dailycaller",
    bias: 1,
    webshotOptions: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4',
      customCSS: '.topad, #masthead, #capture_lightbox_active { display: none !important; }',
    }
  }, {
    name: "NewsMax",
    url: "http://newsmax.com",
    shortName: "newsmax",
    bias: 2
  }, {
    name: "Fox News",
    url: "http://foxnews.com",
    shortName: "foxnews",
    bias: 2
  }, {
    name: "Red State",
    url: "http://redstate.com",
    shortName: "redstate",
    bias: 2
  }, {
    name: "Breitbart",
    url: "http://breitbart.com",
    shortName: "breitbart",
    bias: 2
  }, {
    name: "InfoWars",
    url: "http://infowars.com/news/",
    shortName: "infowars",
    bias: 2
  }, {
    name: "The Blaze",
    url: "http://theblaze.com",
    shortName: "theblaze",
    bias: 2
  }
];

const sitesNonWorking = [
  {
    name: "The Economist",
    url: "http://economist.com",
    shortName: "economist",
    bias: -1
  }
]

module.exports = sites;
