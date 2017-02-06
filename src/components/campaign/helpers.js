const moment = require('moment');

let exports = {
  formcLinks: {
    51: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001693725&action=getcompany',
    52: 'https://www.sec.gov/Archives/edgar/data/1693726/000166850617000003/0001668506-17-000003-index.htm',
    536: 'https://www.sec.gov/cgi-bin/browse-edgar?company=oma%27s&owner=exclude&action=getcompany',
    564: 'https://www.sec.gov/cgi-bin/browse-edgar?company=have+not&owner=exclude&action=getcompany',
  },

  daysLeft(dateTo) {
    return moment(dateTo).diff(moment(), 'days');
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
