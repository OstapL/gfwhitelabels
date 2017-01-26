const moment = require('moment');

module.exports = {
  
  fromNow(dateFrom) {
    return moment(dateFrom).from(moment());
  },

  getStartDate(expirationDate, durationInDays) {
    return moment(expirationDate, 'YYYY-MM-DD').subtract(durationInDays, 'days').format('YYYY-MM-DD');
  },

};
