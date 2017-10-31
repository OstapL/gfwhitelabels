const File = require('./file.js');
const Image = require('./image.js');

const moment = require('moment');

class Investment {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.url = url || app.config.investmentServer + '/' + data.id;

    if (this.data.campaign) {
      this.data.campaign = new app.models.Campaign(this.data.campaign);
    }

    if (this.data.formc) {
      this.data.formc = new app.models.Formc(this.data.formc);
    }

    this.data['investor_presentation_file_id'] = new File(
      this.url,
      this.data.investor_presentation_data
    );

    this.data['header_image_image_id'] = new Image(
      this.url,
      this.data.header_image_data
    );

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

  get createdDate() {
    return moment.parseZone(this.created_date)
  }

  get expired() {
    return this.campaign.expired;
  }

  get cancelled() {
    return this.deposit_cancelled_by_investor || this.deposit_cancelled_by_manager;
  }

  get processed() {
    return this.add_deposit_to_csv;
  }

  get historical() {
    return this.expired || this.cancelled || this.closed;
  }

  get active() {
    return !this.historical;
  }
}

module.exports = Investment;
