/* eslint-disable no-undef */

const sites = [
  {
    name: "Daily Kos",
    url: "http://dailykos.com",
    shortName: "dailykos",
    bias: -2,
    webshotOptions: {
      customCSS: '.mobile-ad, .mobile-petition-ad { display: none !important; }',
    },
    snapFn: function () {
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

      // Support forcing screenshot - fallback
      if (this.forceAfter) {
        setTimeout(function () {
          window.callPhantom('takeShot');
        }, this.forceAfter);
      }
    },
  },

  {
    name: "Huffington Post",
    url: "http://m.huffpost.com",
    shortName: "huffingtonpost",
    bias: -2,
    webshotOptions: {
      shotSize: {
        width: 'window',
        height: 4000
      },
      userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7',
      customCSS: '\
        .card__image__src { position: relative; }\
        .card__image { float: left; }\
        .card__details { display: block; float: right; width: 70%; position: relative; }\
        .card__content { display: block }'
        // .card__content::after { clear: both; display: table; content: "" }'
    },
    snapFn: function () {
      // Huffpo is broken as fuck, because apparently PhantomJS has a borked
      // flexbox implementation. This helps, but it's still broke. Images
      // aren'tin the right places.

      document.body.style.width = '375px';
      var toPin = [];
      toPin.push(document.body);
      toPin = toPin.concat($('.header-container').get());
      toPin = toPin.concat($('.zone').get());
      toPin = toPin.concat($('.card').get());

      for (var i in toPin) {
        toPin[i].style.width = '375px';
      }

      // Wait for jQuery to be loaded
      function jqDefer(fn) {
        var timer = setInterval(function () {
          if (window.jQuery) {
            clearInterval(timer);
            fn();
          }
        }, 100);
      }

      jqDefer(function() {
        $('.advertisement').remove();
        $('.plr-card').remove();
        window.callPhantom('takeShot');
      });

      // Support forcing screenshot - fallback
      if (this.forceAfter) {
        setTimeout(function () {
          window.callPhantom('takeShot');
        }, this.forceAfter);
      }
    },
  },

  {
    name: "Raw Story",
    url: "http://rawstory.com",
    shortName: "rawstory",
    bias: -2,
    webshotOptions: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
    },
    snapFn: function () {
      function removeAllWithSelector (sel) {
        var ads = document.querySelectorAll(sel);

        for (var i = 0; i < ads.length; i++) {
          var ad = ads[i];
          ad.parentElement.removeChild(ad);
        }
      }

      removeAllWithSelector('.advertisement');
      removeAllWithSelector('.footer-outer-wrapper');

      window.callPhantom('takeShot');
    }
  },

  {
    name: "MSNBC",
    url: "http://msnbc.com",
    shortName: "msnbc",
    bias: -2,
    webshotOptions: {
      customCSS: '[id^="google_ads"] { display: none !important }'
    }
  },

  {
    name: "Washington Post",
    url: "http://washingtonpost.com",
    shortName: "wapo",
    bias: -1
  },

  {
    name: "NY Times",
    url: "http://nytimes.com",
    shortName: "nytimes",
    bias: -1,
    snapFn: function () {
      // Wait for jQuery to be loaded
      function jqDefer(deferred) {
        var jqTimer = setInterval(function () {
          if (window.jQuery) {
            clearInterval(jqTimer);
            deferred();
          }
        }, 100);
      }

      jqDefer(function() {
        // Remove multimedia / audio stuff. Thankfully NYTimes has jQuery
        $('.sfg-li:has(iframe)').remove();

        // Remove useless "Daily Briefing"
        $('.sfg-li-briefing').remove();

        // Remove ads
        $('.ad').remove();

        window.callPhantom('takeShot');
      });

      // Support forcing screenshot - fallback
      if (this.forceAfter) {
        setTimeout(function () {
          window.callPhantom('takeShot');
        }, this.forceAfter);
      }
    },
  },

  {
    name: "Reuters",
    url: "http://reuters.com",
    shortName: "reuters",
    bias: 0,
    webshotOptions: {
      customCSS: '.mpu_ad { display: none !important }'
    }
  },

  {
    name: "USA Today",
    url: "http://usatoday.com",
    shortName: "usatoday",
    bias: 0,
    webshotOptions: {
      customCSS: '.ad, partner-banner,  { display: none !important }'
    },
    snapFn: function () {
      setTimeout(function () {
        window.callPhantom('takeShot');
      }, 1000);
    },
  },

  {
    name: "Politico",
    url: "http://politico.com",
    shortName: "politico",
    bias: 0,
    webshotOptions: {
      customCSS: '.global-announce, .super-header { display: none !important; }',
    },
    snapFn: function () {
      // Remove ads
      $('.super:has(.ad)').remove();
      window.callPhantom('takeShot');
    },
  },

  {
    name: "The Hill",
    url: "http://thehill.com",
    shortName: "thehill",
    bias: 0,
    webshotOptions: {
      customCSS: '.OUTBRAIN, .block-dfp { display: none !important; }',
    }
  },

  {
    name: "CNN",
    url: "http://cnn.com",
    shortName: "cnn",
    bias: 0
  },

  {
    name: "Wall Street Journal",
    url: "http://wsj.com",
    shortName: "wsj",
    bias: 0,
    webshotOptions: {
      customCSS: '.wsj-ad { display: none !important; }',
    }
  },

  {
    name: "Associated Press",
    url: "http://apnews.com",
    shortName: "ap",
    bias: 0,
    webshotOptions: {
      customCSS: '.inlineFeedAd, .ad { display: none !important; }',
      userAgent: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
    },
    snapFn: function () {
      $('.cardContainer:has(iframe)').remove();
      $('.ntv-mw').remove();
      window.callPhantom('takeShot');
    }
  },

  {
    name: "BBC News",
    url: "http://bbc.com/news/",
    shortName: "bbc",
    bias: 0
  },

  {
    name: "The Daily Caller",
    url: "http://dailycaller.com",
    shortName: "dailycaller",
    bias: 1,
    webshotOptions: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4',
      customCSS: '.topad, #masthead, #capture_lightbox_active { display: none !important; }',
    }
  },

  {
    name: "NewsMax",
    url: "http://newsmax.com",
    shortName: "newsmax",
    bias: 2
  },

  {
    name: "Fox News",
    url: "http://foxnews.com",
    shortName: "foxnews",
    bias: 2,
    webshotOptions: {
      customCSS: '.advertisement, .ad { display: none !important; }',
    }
  },

  {
    name: "Red State",
    url: "http://redstate.com",
    shortName: "redstate",
    bias: 2,
    webshotOptions: {
      screenSize: {
        width: 375,
        height: 667,
      },
      shotSize: {
        width: "all",
        height: 4000
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
    },
    snapFn: function () {
      function scrollToY(y, cb) {
        $('article:has(.ad)').remove();

        console.log(window.scrollY);
        if (window.scrollY < y) {
          window.scrollBy(0, 50);
          setTimeout(function () {
            scrollToY(y, cb);
          }, 50);
        }
      }

      // Scroll 5000px down before screenshot
      scrollToY(5000, function () {
        window.callPhantom('takeShot');
      });

      // Support forcing screenshot - fallback
      if (this.forceAfter) {
        setTimeout(function () {
          window.callPhantom('takeShot');
        }, this.forceAfter);
      }
    }
  },

  {
    name: "Breitbart",
    url: "http://breitbart.com",
    shortName: "breitbart",
    bias: 2,
    webshotOptions: {
      customCSS: '#cin_header, #BBStoreW { display: none !important; }',
    }
  },

  {
    name: "InfoWars",
    url: "http://infowars.com/news/",
    shortName: "infowars",
    bias: 2
  },

  {
    name: "The Blaze",
    url: "http://theblaze.com",
    shortName: "theblaze",
    bias: 2,
    webshotOptions: {
      customCSS: '.top-ad { display: none !important; }',
    },
    snapFn: function () {
      $('.top-ad').remove();

      // Load more - default isn't enough to fill 4k px height
      $('#load_more_feeds').click()

      setTimeout(function () {
        window.callPhantom('takeShot');
      }, 10000);

      // Support forcing screenshot - fallback
      if (this.forceAfter) {
        setTimeout(function () {
          window.callPhantom('takeShot');
        }, this.forceAfter);
      }
    }
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
