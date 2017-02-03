const moment = require('moment');

module.exports = {
  
  fromNow(dateFrom) {
    return moment(dateFrom).from(moment());
  },

  getStartDate(expirationDate, durationInDays) {
    const date = moment(expirationDate, 'YYYY-MM-DD').subtract(durationInDays, 'days');
    return this.formatDate(date);
  },

  formatDate (date) {
    return moment(date).format('YYYY-MM-DD');
  },

  differenceInDays (dateA, dateB) {
    const num = moment(dateA).diff(dateB, 'days');
    return num < 0 ? -num : num;
  },

};
