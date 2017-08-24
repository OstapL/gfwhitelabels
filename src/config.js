var e = {
  domainUrl: "growthfountain.com",
  serverUrl: "https://django-api-dev.growthfountain.com",
  raiseCapitalServer: "https://api-raisecapital-dev.growthfountain.com",
  //raiseCapitalServer: "http://localhost:8003",
  authServer: "https://api-auth-dev.growthfountain.com",
  //authServer: "http://localhost:8002",
  formcServer: "https://api-formc-dev.growthfountain.com",
  //formcServer: "http://localhost:8001",
  investmentServer: "https://api-investment-dev.growthfountain.com",
  //investmentServer: "http://localhost:8003",
  filerServer: "https://api-filer-dev.growthfountain.com",
  esignServer: 'https://api-esign-dev.growthfountain.com',
  // esignServer: 'https://api-esign.growthfountain.com',
  commentsServer: "https://api-comments-dev.growthfountain.com",
  blogServer: "https://api-blog-dev.growthfountain.com",
  bucketServer: "https://s3.amazonaws.com/growthfountain-alpha-storage",
  // notificationsServer: "https://notifications.growthfountain.com",
  notificationsServer: "https://notifications-dev.growthfountain.com/",
  teamName: 'GrowthFountain Team',
  teamTitle: "Meet The Team",
  siteTitle: "Crowdfunding | Rivermark Community CU",
  //serverUrl: "http://192.168.99.100:8000",
  //serverUrl: "http://gfauth.com:8000",

  // Growth Fountain production keys:
  // facebookClientId: "191471871275050",
  // googleClientId: "488593151885-87nqfd8gl444a1me0n149otrf37dbahq.apps.googleusercontent.com",
  // linkedinClientId: "77wzj6tz0yyr33",
  
  facebookClientId: "1405768896335643",
  googleClientId: "805823281871-0sbsf2btjd5j13g5aa7sfo4pfjorn3k2.apps.googleusercontent.com",
  linkedinClientId: "77wzj6tz0yyr33",

  googleMapKey: "AIzaSyBpCl9-7bkVISZ0o-AaFCsKzZwGAxalkZU",
  stripeKey: "pk_test_Z7YAhlyPtnW7bpd8LJUHTSou",
  googleTagId: 'GTM-WP7K455',
  indexPage: {
    //main slider or img (slider - 1/ img - 0)
    slider: 0,
    campaignListTitle: 'WHAT`S POPULAR', // title main page list campaign
    // url main video 
    videoUrl: 'https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/1191/7/180959588/592220585.mp4?token=1496689595-0x8b9d7c06d2638964fee25840a9f7f5fda3fb3b4c',
    videoPopupUrl: 'https://player.vimeo.com/video/180959588?title=0&byline=0&portrait=0',
    videoTitle: 'A PLATFORM BUILT FOR OUR COMMUNITY',
    videoText: '<h3>Through our partnership with GrowthFountain we\’re pleased to introduce<br> Equity Crowdfunding.</h3>'
    + '<h3>Discover, support and invest in the businesses within our community, and receive<br> ownership for your contribution.</h3>'
    + '<h3>It’s people helping people at an entirely new level.</h3>',
    dataVideoIdPopup: '180959588',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 2,
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 0,
  },
  currentSiteUrl: 'alpha-rivermarkcu.growthfountain.com',
};
module.exports = e;