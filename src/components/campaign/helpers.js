const moment = require('moment');
const today = moment.utc();

const FINANCIAL_INFO = require('consts/financialInformation.json');
const ACTIVE_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_ACTIVE;
const CANCELLED_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_CANCELLED;

let exports = {
  formcLinks: {
    51: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001693725&action=getcompany',
    52: 'https://www.sec.gov/Archives/edgar/data/1693726/000166850617000003/0001668506-17-000003-index.htm',
    536: 'https://www.sec.gov/cgi-bin/browse-edgar?company=oma%27s&owner=exclude&action=getcompany',
    564: 'https://www.sec.gov/cgi-bin/browse-edgar?company=have+not&owner=exclude&action=getcompany',
  },

  slugs: {
    'venue': 51,
    'cogent-education': 52,
    'omas-spirits': 536,
    'have-not-films': 564
  },

  urls: {
    51: 'venue',
    52: 'cogent-education',
    536: 'omas-spirits',
    564: 'have-not-films',
  },

  daysLeft(dateTo) {
    // ToDo
    // Refactor this
    return moment(dateTo).diff(moment(), 'days');
  },

  daysLeftPercentage(data) {
    var daysToExpirate = moment(data.campaign.expiration_date).diff(moment(), 'days');
    return Math.round(
      (moment(data.campaign.expiration_date).diff(data.approved_date, 'days') - daysToExpirate) * 100 / daysToExpirate
    );
  },

  percentage(n, total) {
    return Math.round((n / total) * 100);
  },

  fundedPercentage(campaign, minThreshold=20) {
    let funded = Number(this.percentage(campaign.amount_raised, campaign.minimum_raise));
    funded = isNaN(funded) ? 0 : funded;
    return {
      actual: funded,
      value: funded < minThreshold ? minThreshold : funded,
      text: funded < minThreshold
        ? `Less than ${minThreshold}% Funded`
        : `${funded}% Funded`,
    };
  },

  getImageCampaign (campaign) {
    const imgObj = campaign.header_image_data && campaign.header_image_data.length ? campaign.header_image_data[0] : {};
    const link = imgObj.urls && imgObj.urls.length ? imgObj.urls[0] : location.origin + '/img/default/1600x548.png';
    return link;
  },

  initInvestment(i) {
    i.created_date = moment.isMoment(i.created_date)
      ? i.created_date
      : moment.parseZone(i.created_date);

    i.campaign.expiration_date = moment.isMoment(i.campaign.expiration_date)
      ? i.campaign.expiration_date
      : moment(i.campaign.expiration_date);

    i.expired = i.campaign.expiration_date.isBefore(today);
    i.cancelled = _.contains(CANCELLED_STATUSES, i.status);
    i.historical = i.expired || i.cancelled;
    i.active = !i.historical  && _.contains(ACTIVE_STATUSES, i.status);
  }
};

module.exports = exports;
