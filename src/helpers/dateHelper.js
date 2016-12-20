const moment = require('moment');

module.exports = {
  daysLeft(dateTo) {
    return moment().to(dateTo);
  },

  fromNow(dateFrom) {
    return moment().from(dateFrom);
  },

};
