const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');
const TeamMember = require('./teammembercampaign.js');

const moment = require('moment');
const today = moment.utc();

const FINANCIAL_INFO = require('consts/financialInformation.json');
const ACTIVE_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_ACTIVE;
const CANCELLED_STATUSES = FINANCIAL_INFO.INVESTMENT_STATUS_CANCELLED;


class Campaign {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data || {};
    this.schema = schema;

    if(data && data.id) {
      this.url = url || app.config.raiseCapitalServer + '/campaign/' + data.id;
    } else {
      this.url = url || app.config.raiseCapitalServer + '/campaign';
    }

		this.data['investor_presentation_file_id'] = new File(
			this.url,
			this.data.investor_presentation_data
		);
		this.data['list_image_image_id'] = new Image(
			this.url,
			this.data.list_image_data
		);
		this.data['header_image_image_id'] = new Image(
			this.url,
			this.data.header_image_data
		);
		this.data['gallery_group_id'] = new Gallery(
			this.url,
			this.data.gallery_group_id,
			this.data.gallery_group_data
		);
		this.data.team_members = new TeamMember.TeamMemberFactory(
			this.data.team_members,
      this.schema.team_members,
			this.url + '/team-members'
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
		if (data.investor_presentation_file_id) {
			data['investor_presentation_file_id'] = this.data.investor_presentation_file_id.id;
		}
		if (data.list_image_image_id) {
			data['list_image_image_id'] = data.list_image_image_id.id;
		}
		if (this.data.header_image_image_id) {
			data['header_image_image_id'] = data.header_image_image_id.id;
		}
		if (this.data.gallery_group_id) {
			data['gallery_group_id'] = data.gallery_group_id.id;
		}
		if (this.data.team_members.members.length > 0) {
			data.team_members = this.data.team_members.toJSON();
		}
    return data;
  }

  daysLeft(dateTo) {
    return moment(this.expiration_date).diff(moment(), 'days');
  }

  daysPassedPercentage(approved_date) {
    let now = moment();
    let expirationDate = moment.isMoment(this.expiration_date)
      ? this.expiration_data
      : moment(this.expiration_date);
    let approvedDate = moment.isMoment(approved_date)
      ? approved_date
      : moment.utc(approved_date);

    let daysPassedPercents = Math.round(now.diff(approvedDate, 'days') / expirationDate.diff(approvedDate, 'days') * 100);
    if (daysPassedPercents < 0) daysPassedPercents = 0;
    if (daysPassedPercents > 100) daysPassedPercents = 100;
    return daysPassedPercents;
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
    const link = this.header_image_data && this.header_image_data.urls ? 
      this.header_image_image_id.getUrl('main') : '';
    return link;
  }

  getInvestorPresentationURL() {
    if (!this.investor_presentation_data ||
        !this.investor_presentation_data.urls ||
        !this.investor_presentation_data.urls.origin
    )
      return '';

    return app.getFilerUrl(this.investor_presentation_data.urls);
  }

  get expirationDate() {
    return moment(this.expiration_date);
  }

  get expired() {
    return this.expirationDate.isBefore(today);
  }
}

module.exports = Campaign
