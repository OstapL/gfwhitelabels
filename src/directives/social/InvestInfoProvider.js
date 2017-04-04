const CORPORATE_STRUCTURE = require('consts/raisecapital/corporate_structure.json');
const campaignHelper = require('components/campaign/helpers.js');

const ShareInfoProvider = require('src/directives/social/infoProvider.js');

class InvestorInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);
    this.__initData(model);
  }

  __initData(model) {
    if (this.data)
      return;

    let companyName = model.short_name || model.name || '';

    this.data = {
      title: 'I invested in ' + companyName + ' on ' + window.location.host,
      url: `${window.location.origin}/${model.slug || model.id}`,
      description: model.description,
      companyName: companyName,
      corporateStructure: CORPORATE_STRUCTURE[model.corporate_structure] || '',
      picture: campaignHelper.getImageCampaign(model.campaign),
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
      '?url=' + this.data.url +
      '&text=' + 'I invested in ' + this.data.companyName + ' on @growthfountain';
  }

  linkedin() {
    return {
      content: {
        'title': this.data.title,
        'description': this.data.description,
        'submitted-url': this.data.url,
        'submitted-image-url': this.data.picture,
      },
      'visibility': {
        'code': 'anyone'
      }
    };
  }

  facebook() {
    return 'https://www.facebook.com/dialog/share' +
      '?app_id=' + app.config.facebookClientId +
      '&href=' + this.data.url + '?r=' + Math.random() +
      '&description=' + this.data.description +
      '&locale=' + 'en_US' +
      '&picture=' + this.data.picture +
      '&title=' + this.data.title +
      '&caption=' + window.location.host.toUpperCase();
  }

  email() {
    return 'mailto:' +
      '?subject=' + this.data.title +
      '&body=' + (this.data.title +  '%0D%0A') + this.data.url;
  }

  confirmationMessage(network) {
    return `Would you like to share that you invested in ${this.data.companyName} with your ${network} Network?`;
  }
}

module.exports = InvestorInfoProvider;