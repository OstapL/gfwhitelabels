var e = {
  domainUrl: "growthfountain.com",
  serverUrl: "https://django-api-dev.growthfountain.com",
  raiseCapitalServer: "https://api-raisecapital-dev.growthfountain.com",
// raiseCapitalServer: "http://localhost:8003",
  authServer: "https://api-auth-dev.growthfountain.com",
// authServer: "http://localhost:8002",
  formcServer: "https://api-formc-dev.growthfountain.com",
// formcServer: "http://localhost:8001",
  investmentServer: "https://api-investment-dev.growthfountain.com",
// investmentServer: "http://localhost:8003",
  filerServer: "https://api-filer-dev.growthfountain.com",
  esignServer: 'https://api-esign-dev.growthfountain.com',
//  esignServer: 'https://api-esign.growthfountain.com',
  commentsServer: "https://api-comments-dev.growthfountain.com",
  blogServer: "https://api-blog-dev.growthfountain.com",
  notificationsServer: "https://notifications-dev.growthfountain.com/",
  bucketServer: "https://s3.amazonaws.com/growthfountain-alpha-storage",

  teamName: 'GrowthFountain Team',
  teamTitle: "Meet The Team",
  title: "Crowdfunding | Momentum3 Growth",
// serverUrl: "http://192.168.99.100:8000",
// serverUrl: "http://gfauth.com:8000",


// Growth Fountain production keys:
//  facebookClientId: "191471871275050",
//  googleClientId: "488593151885-87nqfd8gl444a1me0n149otrf37dbahq.apps.googleusercontent.com",
//  linkedinClientId: "77wzj6tz0yyr33",

  facebookClientId: "1071081646296574",
  googleClientId: "805823281871-ve3unmva9aer69papghudk0dnpf8tqr2.apps.googleusercontent.com",
  linkedinClientId: "77rg2wrcb8utfq",


  googleMapKey: "AIzaSyBpCl9-7bkVISZ0o-AaFCsKzZwGAxalkZU",
  stripeKey: "pk_live_4ZF2RPjAVJ0tXrDNMauofmgb",

  googleTagID: 'GTM-NC9XW5D',
  googleAnalyticsID: 'UA-47199302-5',
  googleAnalyticsIDGeneral: 'UA-47199302-1',
  facebookPixelID: 172026009946228,
  yandexMetricaID: 42321779,

  indexPage: {
    //main slider or img (slider - 1/ img - 0)
    slider: 0,
    campaignListTitle: 'TRENDING', // title main page list campaign
    // url main video 
    videoUrl: 'https://d2i0hc81gw5f0c.cloudfront.net/videos/main-video.m4v',
    videoPopupUrl: 'https://player.vimeo.com/video/198101157?title=0&amp;byline=0&amp;controls=0&fullscreen=1&buttons.share = false&embed.buttons.like = false;autoplay=0&portrait=0',
    videoTitle: 'A NEW WAY TO INVEST OR RAISE CAPITAL',
    videoText: '<h3>Through our partnership with Growth Fountain we\'re pleased <br>to introduce Equity Crowdfunding.</h3>'
    + '<h3>Discover, support and invest in the businesses within our <br> community, and receive ownership for your contribution.</h3>'
    + '<h3>It’s people helping people at an entirely new level.</h3>',
    dataVideoIdPopup: '198101157',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 0,
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 1,
  },
};
module.exports = e;