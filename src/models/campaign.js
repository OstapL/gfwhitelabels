const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');
const TeamMember = require('./teammembercampaign.js');

const moment = require('moment');
const today = moment.utc();

const FINANCIAL_INFO = require('consts/financialInformation.json');

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
    //sort perks asc
    if (this.perks && this.perks.length)
      this.perks.sort((p1, p2) => p1.amount - p2.amount);
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

  daysLeft() {
    let days = Math.ceil(moment(this.expiration_date).diff(moment(), 'days', true));
    if (days < 0)
      days = 0;

    return days;
  }

  daysLeftText() {
    const daysLeft = this.daysLeft();
    return daysLeft === 1
      ? `${daysLeft} Day Left`
      : `${daysLeft} Days Left`;
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
    // Vlad
    console.debug('Use campaign.header_image_id.getUrl("main")');
    const link = this.header_image_data && this.header_image_data.urls ? 
      this.header_image_image_id.getUrl('main') : '';
    return link;
  }

  getInvestorPresentationURL() {
    // Vlad
    console.debug('Use campaign.investor_presentation_id.getUrl("origin")');
    if (!this.investor_presentation_data ||
        !this.investor_presentation_data.urls ||
        !this.investor_presentation_data.urls.origin
    )
      return '';
    return this.investor_presentation_data.getUrl();
  }

  calcProgress(data) {
    try {
      return {
        'general_information':
          this.pitch.length > 5 &&
          this.intended_use_of_proceeds.length > 5 &&
          this.business_model.length > 5,
        'media':
          this.video != '' &&
          this.header_image_image_id.id != null &&
          this.list_image_image_id.id != null &&
          this.gallery_group_id.data.length > 2,
        'specifics':
          this.minimum_raise >= 10000 &&
          this.maximum_raise <= 1070000 &&
          this.minimum_increment >= 100 &&
          this.length_days >= 60 &&
          this.investor_presentation_file_id.id != null &&
          (this.security_type == 1 || 
           (this.security_type == 0 && this.premoney_valuation > 0) || 
           (this.security_type == 2 && this.premoney_valuation > 0 && this.hybrid_toggle_amount >= 1000)
          ),
        'team-members': 
          this.team_members.members.length > 0  /* && 
          (this.team_members.members.find((el) => {
            return el.data.photo_image_id.id == null }
          ) === undefined)*/,
        'perks': this.perks.length > 0
      }
    } catch(e) {
      return {};
    }
  }

  updateMenu(progress) {
    let complited = 0;
    Object.keys(progress).forEach((k) => {
      const v = progress[k];
      let el = null;
      if(v == false) {
        el = document.querySelector('#menu_c_' + k + ' .icon-check');
        if(el != null) {
          el.remove();
        }
      } else {
        if(k != 'perks') {
          complited ++;
        }
        if(document.querySelector('#menu_c_' + k + ' .icon-check') == null) {
          document.querySelector('#menu_c_' + k).innerHTML += ' <div class="icon-check"><i class="fa fa-check-circle-o"></i></div>';
        }
      }
    });
    if(complited == 4) {
      document.querySelectorAll('#form_c a.disabled').forEach((v, i) => {
        v.className = v.className.replace('disabled', '');
      });
      // ToDo
      // Fix this
      var formcClass = new app.models.Formc(app.user.formc);
      formcClass.updateMenu(formcClass.calcProgress());
    }
  }

  get expirationDate() {
    return moment(this.expiration_date);
  }

  get expired() {
    return this.expirationDate.isSameOrBefore(today);
  }

  get successful() {
    return this.amount_raised >= this.minimum_raise;
  }

}

module.exports = Campaign;
