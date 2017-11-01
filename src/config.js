var e = {
  domainUrl: "growthfountain.com",
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
  siteTitle: 'Crowdfunding | GrowthFountain Equity Crowdfunding',

  facebookClientId = "547857385398592",
  googleClientId = "372921150-paa9eek64iuo2d5pmg7nraivc72g0sfo.apps.googleusercontent.com",
  linkedinClientId = "77hgtbs9rkjk20",

  googleMapKey: "AIzaSyBpCl9-7bkVISZ0o-AaFCsKzZwGAxalkZU",
  stripeKey: "pk_test_Z7YAhlyPtnW7bpd8LJUHTSou",

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
    topBannerText: 'TVFCU (Tennessee Valley Federal Credit Union) is not a registered broker/dealer, nor is it affiliated with GrowthFountain LLC, GrowthFountain Capital LLC, or the issuers of securities on this site. Neither TVFCU nor its officers, directors, or employees make any warranty, express or implied, of any kind whatsoever related to the adequacy, accuracy, or completeness of any information on this site or the use of information on this site. TVFCU does not give investment advice or recommendations for any investment offered on this platform and no communication, through this web site or otherwise, should be construed as such.',
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 0,
  },
  currentSiteUrl: 'alpha-tvfcu.growthfountain.com',
};

module.exports = e;
