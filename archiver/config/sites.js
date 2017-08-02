/* eslint-disable no-undef */

const sites = [
  {
    name: "Daily Kos",
    url: "http://dailykos.com",
    shortName: "dailykos",
    bias: -2,
    webshotOptions: {
      onLoadFinished: function () {
      },
      customCSS: '.mobile-ad, .mobile-petition-ad {display: none !important; }'
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
    bias: -2
  }, {
    name: "MSNBC",
    url: "http://msnbc.com",
    shortName: "msnbc",
    bias: -2,
    webshotOptions: {
      onLoadFinished: function () {
        var ads = document.querySelectorAll('[id^="google_ads"]');

        for (var i = 0; i < ads.length; i++) {
          var ad = ads[i];
          ad.parentElement.removeChild(ad);
        }
      }
    }
  }, {
    name: "Washington Post",
    url: "http://washingtonpost.com",
    shortName: "washingtonpost",
    bias: -1
  }, {
    name: "NY Times",
    url: "http://nytimes.com",
    shortName: "nytimes",
    bias: -1
  }, {
    name: "Reuters",
    url: "http://reuters.com",
    shortName: "reuters",
    bias: 0
  }, {
    name: "USA Today",
    url: "http://usatoday.com",
    shortName: "usatoday",
    bias: 0
  }, {
    name: "Politico",
    url: "http://politico.com",
    shortName: "politico",
    bias: 0
  }, {
    name: "The Hill",
    url: "http://thehill.com",
    shortName: "thehill",
    bias: 0
  }, {
    name: "CNN",
    url: "http://cnn.com",
    shortName: "cnn",
    bias: 0
  }, {
    name: "Wall Street Journal",
    url: "http://wsj.com",
    shortName: "wsj",
    bias: 0
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
    name: "The Daily Caller",
    url: "http://dailycaller.com",
    shortName: "dailycaller",
    bias: 1
  }, {
    name: "The Economist",
    url: "http://economist.com",
    shortName: "economist",
    bias: -1
  }
]

module.exports = sites;
