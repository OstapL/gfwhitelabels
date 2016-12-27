const moment = require('moment');

module.exports = {
  daysLeft(dateTo) {
    return moment(dateTo).diff(moment(), 'days');
  },

  fromNow(dateFrom) {
    return moment(dateFrom).from(moment());
  },

  getStartDate(expirationDate, durationInDays) {
    return moment(expirationDate, 'YYYY-MM-DD').subtract(durationInDays, 'days').format('YYYY-MM-DD');
  },

};
