const safeDataLayerPush = (eventName, eventData) => {
  if (!window.dataLayer)
    return console.warn('No data layer found! It looks like GTM scripts blocked');

  if (!eventName)
    return console.error('Event name is not provided');

  if (!analytics.events[eventName])
    return console.error(`Event: ${eventName} is not allowed`);

  eventData = typeof(eventData) !== 'object' ? {} : eventData;
  eventData.event = eventName;

  dataLayer.push(eventData);
};

const analytics = {
  events: {
    LoggedIn: 'LoggedIn',
    RegistrationCompleted: 'RegistrationCompleted',
    InvestmentMade: 'InvestmentMade',
    InvestmentClicked: 'InvestmentClicked',
    InvestmentCancelled: 'InvestmentCancelled',
    CampaignStarted: 'CampaignStarted',
    CampaignSubmitted: 'CampaignSubmitted',
    CalculatorUsed: 'CalculatorUsed',
    VideoViewed: 'VideoViewed',
    CompanyCustomEvent: 'CompanyCustomEvent',
    EmailSubscription: 'EmailSubscription',
  },

  emitEvent(name, data) {
    return safeDataLayerPush(name, data);
  },

  emitCompanyCustomEvent(ids) {
    return analytics.emitEvent(analytics.events.CompanyCustomEvent, ids);
  },
};

module.exports = analytics;

//TODO: view this code and move logic to GTM
// //move this logic to GTM side
// emitFacebookPixelEvent(eventName='ViewContent', params={}) {
//   if (!this.config.googleTagID || !this.config.facebookPixelID)
//     return;
//
//   const STANDARD_EVENTS = [
//     'ViewContent',
//     'Search',
//     'AddToCart',
//     'AddToWishlist',
//     'InitiateCheckout',
//     'AddPaymentInfo',
//     'Purchase',
//     'Lead',
//     'CompleteRegistration',
//   ];
//
//   let trackType = STANDARD_EVENTS.includes(eventName) ? 'track' : 'trackCustom';
//
//   safeDataLayerPush({
//     event: 'fb-pixel-event',
//     trackType,
//     eventName,
//   });
// }
//
// emitGoogleAnalyticsEvent(eventName, params={}) {
//   if (!this.config.googleTagID)
//     return;
//
//   if (!eventName)
//     return console.error('eventName is not set');
//
//   let hasRequiredParams = ['eventAction', 'eventCategory'].every(paramName => !!params[paramName]);
//   if (!hasRequiredParams)
//     return console.error('Required params are not set');
//
//   params.event = eventName;
//   safeDataLayerPush(params);
// }
//
// emitCompanyAnalyticsEvent(trackerId) {
//   if (!this.config.googleTagID)
//     return;
//
//   if (!trackerId)
//     return;
//
//   safeDataLayerPush({
//     event: 'company-custom-event',
//     eventCategory: 'Company',
//     eventAction: 'ViewPage',
//     trackerId,
//   });
// }
//
// emitAnalyticsEvent(eventName, eventData={}) {
//   if (!this.config.googleTagID)
//     return;
//
//   if (!eventName)
//     return console.error('Event Name is not set');
//
//   safeDataLayerPush();
// }
