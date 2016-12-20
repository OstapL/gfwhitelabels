const moment = require('moment');

module.exports = {
  daysLeft(dateTo) {
    return moment().from(dateTo)
  },

};
