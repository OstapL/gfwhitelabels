const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');

const moment = require('moment');
const today = moment.utc();

const FINANCIAL_INFO = require('consts/financialInformation.json');
const ACTIVE_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_ACTIVE;
const CANCELLED_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_CANCELLED;


class Campaign {
  constructor(urlRoot, data={}, schema={}) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.urlRoot = urlRoot;

    for(let key in this.schema) {
      if(this.data.hasOwnProperty(key)) {
        switch(this.schema[key].type) {
          case 'file':
            this.data[key] = new File(urlRoot, this.data[key.replace('_file_id', '_data')]);
            break;
          case 'image':
            this.data[key] = new Image(urlRoot, this.data[key.replace('_image_id', '_data')]);
            break;
          case 'filefolder':
            this.data[key] = new Folder(urlRoot, this.data[key], this.data[key.replace('_id', '_data')]);
            break;
          case 'imagefolder':
            this.data[key] = new Gallery(urlRoot, this.data[key], this.data[key.replace('_id', '_data')]);
            break;
        }
      }
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
    for(let key in this.schema) {
      if(this.data.hasOwnProperty(key)) {
        switch(this.schema[key].type) {
          case 'file':
          case 'image':
          case 'filefolder':
          case 'imagefolder':
            data[key] = this.data[key].id;
            break;
        }
      }
    }
    return data;
  }

  daysLeft(dateTo) {
    return moment(this.expiration_date).diff(moment(), 'days');
  }

  daysLeftPercentage(data) {
    let daysToExpirate = moment(data.campaign.expiration_date).diff(moment(), 'days');
    return Math.round(
      (moment(data.campaign.expiration_date).diff(data.approved_date, 'days') - daysToExpirate) * 100 / daysToExpirate
    );
  }

  percentage(n, total) {
    return Math.round((n / total) * 100);
  }

  fundedPercentage(minThreshold=20) {
    let funded = Number(this.percentage(this.amount_raised, this.minimum_raise));
    funded = isNaN(funded) ? 0 : funded;
    return {
      actual: funded,
      value: funded < minThreshold ? minThreshold : funded,
      text: funded < minThreshold
        ? `Less than ${minThreshold}% Funded`
        : `${funded}% Funded`,
    };
  }

  getMainImage () {
    const link = this.header_image_data && this.header_image_data.urls ? this.header_image_data.urls.main : '';
    return link;
  }

  initInvestment(i) {
    i.created_date = moment.isMoment(i.created_date)
      ? i.created_date
      : moment.parseZone(i.created_date);

    i.campaign.expiration_date = moment.isMoment(i.campaign.expiration_date)
      ? i.campaign.expiration_date
      : moment(i.campaign.expiration_date);

    i.expired = i.campaign.expiration_date.isBefore(today);
    i.cancelled = _.contains(CANCELLED_STATUSES, i.status);
    i.historical = i.expired || i.cancelled;
    i.active = !i.historical  && _.contains(ACTIVE_STATUSES, i.status);
  }
}

module.exports = Campaign
