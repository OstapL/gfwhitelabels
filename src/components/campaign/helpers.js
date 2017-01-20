const moment = require('moment');

let exports = {
  formcLinks: {
    52: 'https://www.sec.gov/Archives/edgar/data/1693726/000166850617000003/0001668506-17-000003-index.htm',
    536: 'https://www.sec.gov/Archives/edgar/data/1694088/000166850617000001/0001668506-17-000001-index.htm',
  },

  daysLeft(dateTo) {
    //expect utc string here
    dateTo = _.isString(dateTo) ? moment.parseZone(dateTo) : moment(dateTo);
    return dateTo.diff(moment(), 'days');
  },

  percentage(n, total) {
    return Math.round((n / total) * 100);
  },

};

module.exports = exports;
