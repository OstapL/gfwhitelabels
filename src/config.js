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
  emailServer: "https://api-email-dev.growthfountain.com",
  bucketServer: "https://s3.amazonaws.com/growthfountain-alpha-storage",
  notificationsServer: "https://notifications-dev.growthfountain.com/",
  teamName: 'Team',
  teamTitle: "Meet The Team",
  siteTitle: 'GrowthFountain | Equity Crowdfunding Platform',

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
  googleAnalyticsID: 'UA-97185485-1',
  googleAnalyticsIDGeneral: 'UA-97185485-3',
  facebookPixelID: 1020185798119090,

  indexPage: {
    //main slider or img (slider - 1/ img - 0)
    slider: 1,
    campaignListTitle: 'CURRENT CAMPAIGNS', // title main page list campaign
    videoPopupUrl: 'https://player.vimeo.com/video/198101157?title=0&amp;byline=0&amp;controls=0&fullscreen=1&buttons.share = false&embed.buttons.like = false;autoplay=0&portrait=0',
    videoTitle: 'WHAT IS GROWTHFOUNTAIN?',
    videoText: '<h3>We banded together with a simple mission: to simplify fundraising <br> and help businesses raise capital.</h3>'
    + '<h3>Everybody in the world now has the ability to invest directly <br> in America’s entrepreneurs!</h3>',
    dataVideoIdPopup: '198101157',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 0,
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 1,
  },
  currentSiteUrl: 'alpha.growthfountain.com',
};

module.exports = e;
