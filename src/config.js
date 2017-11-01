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
  siteTitle: "Crowdfunding | Digital Federal Credit Union",
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
    slider: 1,
    campaignListTitle: 'TRENDING', // title main page list campaign
    // url main video 
    videoUrl: 'https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/4266/7/196334693/659039736.mp4?token=1496682220-0x3d9ecf2e6990544ed99f350ec2c872348f32a008',
    videoPopupUrl: 'https://player.vimeo.com/video/196334693?title=0&amp;byline=0&amp;controls=0&fullscreen=1&buttons.share = false&embed.buttons.like = false;autoplay=0&portrait=0',
    videoTitle: 'CONNECTING INVESTORS AND ENTREPRENEURS',
    videoText: '<p>This innovative equity crowdfunding partnership between DCU and GrowthFountain offers investors <br> and entrepreneurs a unique way to connect, invest, raise capital, and grow ideas.</p>'
    + '<p>Local and national entrepreneurs can use this as a way to connect with and <br> raise capital from investors interested in their ideas and small businesses.</p>'
    + '<p>Whether you’re an interested investor looking for exciting ideas and businesses to back or an entrepre - <br> neur looking to grow your business, this platform is a great way to get started.</p>',
    dataVideoIdPopup: '196334693',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 1,
    topBannerText: 'DCU (Digital Federal Credit Union) is not a registered broker/dealer, nor is it affiliated with GrowthFountain LLC, GrowthFountain Capital LLC, or the issuers of securities on this site.  Neither DCU nor its officers, directors, or employees make any warranty, express or implied, of any kind whatsoever related to the adequacy, accuracy, or completeness of any information on this site or the use of information on this site.  DCU does not give investment advice or recommendations for any investment offered on this platform and no communication, through this web site or otherwise, should be construed as such.',

    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 0,
  },
  currentSiteUrl: 'alpha-dcu.growthfountain.com',
};
module.exports = e;