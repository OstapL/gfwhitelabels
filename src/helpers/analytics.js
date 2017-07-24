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
    RegistrationCompleted: 'RegistrationCompleted',
    InvestmentMade: 'InvestmentMade',
    InvestmentClicked: 'InvestmentClicked',
    InvestmentCancelled: 'InvestmentCancelled',
    CampaignStarted: 'CampaignStarted',
    CampaignSubmitted: 'CampaignSubmitted',
    CalculatorUsed: 'CalculatorUsed',
    VideoViewed: 'VideoViewed',
    CompanyCustomEvent: 'CompanyCustomEvent',
  },

  emitEvent(name, data) {
    return safeDataLayerPush(name, data);
  },

  emitCompanyCustomEvent(trackerId) {
    if (!trackerId)
      return;

    return analytics.emitEvent(analytics.events.CompanyCustomEvent, { trackerId });
  },
};

module.exports = analytics;