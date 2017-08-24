const moment = require('moment');

module.exports = {
  
  fromNow(dateFrom) {
    const now = moment.utc();
    return moment.utc(dateFrom).from(now);
  },

  getStartDate(expirationDate, durationInDays) {
    const date = moment(expirationDate, 'YYYY-MM-DD').subtract(durationInDays, 'days');
    return this.formatDate(date);
  },

  formatDate(date, format='YYYY-MM-DD') {
    return moment(date).format(format);
  },

  formatTime(date) {
    return moment(date).format('HH:MM:SS');
  },

  differenceInDays (dateA, dateB) {
    const num = moment(dateA).diff(dateB, 'days');
    return num < 0 ? -num : num;
  },

  nowAsString() {
    return moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
  }

};
