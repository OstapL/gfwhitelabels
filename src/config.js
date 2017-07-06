var e = {
  domainUrl: "growthfountain.com",
  serverUrl: "https://django-api-dev.growthfountain.com",
  raiseCapitalServer: "https://api-raisecapital-dev.growthfountain.com",
  authServer: "https://api-auth-dev.growthfountain.com",
  formcServer: "https://api-formc-dev.growthfountain.com",
  investmentServer: "https://api-investment-dev.growthfountain.com",
  filerServer: "https://api-filer-dev.growthfountain.com",
  esignServer: 'https://api-esign-dev.growthfountain.com',
  commentsServer: "https://api-comments-dev.growthfountain.com",
  blogServer: "https://api-blog-dev.growthfountain.com",
  bucketServer: "https://s3.amazonaws.com/growthfountain-alpha-storage",
  notificationsServer: "https://notifications-dev.growthfountain.com/",
  teamName: 'GrowthFountain Team',
  teamTitle: "Meet The Team",
  siteTitle: '| GrowthFountain Equity Crowdfunding',

  // Growth Fountain production keys:
  // facebookClientId: "191471871275050",
  // googleClientId: "488593151885-87nqfd8gl444a1me0n149otrf37dbahq.apps.googleusercontent.com",
  // linkedinClientId: "77wzj6tz0yyr33",

  facebookClientId: "1405768896335643",
  googleClientId: "805823281871-0sbsf2btjd5j13g5aa7sfo4pfjorn3k2.apps.googleusercontent.com",
  linkedinClientId: "77wzj6tz0yyr33",

  googleMapKey: "AIzaSyBpCl9-7bkVISZ0o-AaFCsKzZwGAxalkZU",
  stripeKey: "pk_test_Z7YAhlyPtnW7bpd8LJUHTSou",

  //analytics services settings
  googleTagID: 'GTM-WP7K455',

  indexPage: {
    //main slider or img (slider - 1/ img - 0)
    slider: 0,
    campaignListTitle: 'What’s popular', // title main page list campaign
    videoPopupUrl: 'https://player.vimeo.com/video/198101157?title=0&amp;byline=0&amp;controls=0&fullscreen=1&buttons.share = false&embed.buttons.like = false;autoplay=0&portrait=0',
    videoTitle: 'A NEW WAY TO INVEST OR RAISE CAPITAL',
    videoText: '<h3>Through our partnership with Growth Fountain we\'re pleased <br> to introduce Equity Crowdfunding.</h3>'
    + '<h3>Discover, support and invest in the businesses within our <br> community, and receive ownership for your contribution.</h3>'
    + '<h3>It’s people helping people at an entirely new level.</h3>',
    dataVideoIdPopup: '198101157',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 1,
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 0,
  },
};

module.exports = e;
