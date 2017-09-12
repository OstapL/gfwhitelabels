
const moment = require('moment');
const COMPANY_STATUS = require('consts/raisecapital/companyStatuses.json').STATUS;

class Company {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data || {};
    this.schema = schema;
    if(data && data.id) {
      this.url = url || app.config.raiseCapitalServer + '/company/' + data.id;
    } else {
      this.url = url || app.config.raiseCapitalServer + '/company';
    }

    if(this.data.campaign) {
      this.data.campaign = new app.models.Campaign(this.data.campaign);
    }

    if(this.data.formc) {
      this.data.formc = new app.models.Formc(this.data.formc);
    }

    this.data = Object.seal(this.data);
    for(let key in this.data) {
      Object.defineProperty(this, key, {
        get: function(value) { return this.data[key]; },
        set: function(value) { this.data[key] = value; },
      });
    }
  }

  toJSON() {
    let data = Object.assign({}, this.data);
    return data;
  }

  isNew() {
    const today = moment();
    const approvedDate = moment(this.approved_date);
    return Math.ceil(today.diff(approvedDate, 'days', true)) <= 10;
  }

  isClosed() {
    return this.is_approved === COMPANY_STATUS['SUCCESSFULY CLOSED'] ||
     this.is_approved === COMPANY_STATUS['UNSUCESSFULY CLOSED'];
  }
}

module.exports = Company;
