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
  title: "Crowdfunding | Jeanne D'Arc CU",
  footerText: "The investment opportunities and/or products offered through GrowthFountain are not insured by Jeanne D'Arc Credit Union. Deposits/investments are not insured by the National Credit Union Administration (NCUA) or the Massachusetts Share Insurance Corporation (MSIC). These investment opportunities/products are not obligations of Jeanne D’Arc Credit Union and are not endorsed, recommended or guaranteed by Jeanne D'Arc Credit Union or any government agency. The value of the investment may fluctuate, the return on the investment is not guaranteed, and loss of principal is possible. Jeanne D'Arc Credit Union is not a registered broker-dealer nor are they affiliated with GrowthFountain. Jeanne D'Arc Credit Union has contracted with GrowthFountain to make potential non-deposit investment opportunities and products available to credit union members.",

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
    videoUrl: 'https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/1191/7/180959374/592219733.mp4?token=1496687755-0xed3bf6c7b33568ddf73ebda42e21d412fb6a7361',
    videoPopupUrl: 'https://player.vimeo.com/video/180959374?title=0&amp;byline=0&amp;portrait=0',
    videoTitle: 'A NEW WAY TO INVEST OR RAISE CAPITAL',
    videoText: '<p class="font-weight-normal">Through our partnership with Growth Fountain we\'re pleased to introduce Equity Crowdfunding. <br> With this innovative program:</p>'
    + '<p class="m-t-0 m-b-0">- Investors and entrepreneurs can connect to enrich each other.'
    +'<br>- Investors receive equity for their contributions to small businesses.'
    + '<br>- Entrepreneurs can raise capital for their businesses through these contributions'
    + '<br>- Opportunities are available on local and national levels.'
    + '<br>- Economic growth is spurred by greater exposure and interest.</p>',
    dataVideoIdPopup: '180959374',
    dataProviderVideoPopup: 'vimeo',
    // top banner (none - 0 / dcu - 1 / river - 2)
    topBanner: 0,
    //bottom banner (1 - raise capital/ 0 - INVEST)
    bottomBunner: 0,
  },
  currentSiteUrl: 'alpha-jdcu.growthfountain.com',
};
module.exports = e;
