const CORPORATE_STRUCTURE = require('consts/raisecapital/corporate_structure.json').CORPORATE_STRUCTURE;

const ShareInfoProvider = require('src/directives/social/infoProvider.js');

class InvestorInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);

    this.templates = {
      emailSubject: 'Everyone’s doing it! I just invested in :company on :siteName',
      emailBody: 'Hi! I just made an investment in :company and you can too! ' +
      'You can now invest in local businesses and entrepreneurs you believe in – starting at ' +
      '$:invest.' +
      '%0D%0A%0D%0ACome take a look: :url',
      title: 'Everyone’s doing it! I just invested in :company on :siteName',
      confirmationMessage: 'Would you like to share that you invested in :company ' +
      'with your :network network?',
    };

    this.__initData(model);
  }

  __initData(model) {

    let companyName = model.short_name || model.name || '';

    this.data = {
      minInvestment: (model && model.campaign && model.campaign.minimum_increment)
        ? model.campaign.minimum_increment
        : 100,
      title: this._format('title', { company: companyName, siteName: this.data.siteName }),
      url: window.location.origin + '/' + (model.slug || model.id) + '/invest-thanks-share',
      description: model.description,
      companyName: companyName,
      corporateStructure: CORPORATE_STRUCTURE[model.corporate_structure] || '',
      picture: model.campaign.getMainImage(),
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
      '?url=' + this.data.url +
      '&text=' + encodeURIComponent(this._format('title', {
        company: this.data.companyName,
        siteName: '@GrowthFountain',
      }) + '\r\n');
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

  email() {
    return 'mailto:' +
      '?subject=' + this._format('emailSubject', {
        company:  this.data.companyName,
        siteName: this.data.siteName,
      }) +
      '&body=' + this._format('emailBody', {
        company: this.data.companyName,
        url: this.data.url,
        invest: this.data.minInvestment,
      });
  }

  confirmationMessage(network) {
    return this._format('confirmationMessage', {
      company: this.data.companyName,
      network,
    });
  }
}

module.exports = InvestorInfoProvider;
