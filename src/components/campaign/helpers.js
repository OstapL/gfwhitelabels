const moment = require('moment');

let exports = {
  formcLinks: {
    51: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001693725&action=getcompany',
    52: 'https://www.sec.gov/Archives/edgar/data/1693726/000166850617000003/0001668506-17-000003-index.htm',
    536: 'https://www.sec.gov/Archives/edgar/data/1694088/000166850617000001/0001668506-17-000001-index.htm',
  },

  daysLeft(dateTo) {
    // ToDo
    // Refactor this
    return moment(dateTo).diff(moment(), 'days');
  },

  daysLeftPercentage(data) {
    var daysToExpirate = moment(data.campaign.expiration_date).diff(moment(), 'days')
    return Math.round(
      (moment(data.campaign.expiration_date).diff(data.approved_date, 'days') - daysToExpirate) * 100 / daysToExpirate
    );
  },

  percentage(n, total) {
    return Math.round((n / total) * 100);
  },

  getImageCampaign (campaign) {
    const imgObj = campaign.header_image_data && campaign.header_image_data.length ? campaign.header_image_data[0] : {};
    const link = imgObj.urls && imgObj.urls.length ? imgObj.urls[0] : location.origin + '/img/default/1600x548.png';
    return link;
  },
};

module.exports = exports;
