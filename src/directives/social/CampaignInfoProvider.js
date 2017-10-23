const CORPORATE_STRUCTURE = require('consts/raisecapital/corporate_structure.json').CORPORATE_STRUCTURE;

const ShareInfoProvider = require('src/directives/social/infoProvider.js');

class CampaignInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);

    this.templates = {
      title: 'You want a piece of this!? Invest in :company on :siteName',
      emailBody: 'Hi! I think you should check out :company\'s fundraise on :siteName. ' +
      'You now have the opportunity to own a piece of your favorite company for as little as $:invest.' +
      '%0D%0A%0D%0A' +
      'Come take a look: :url',
      confirmationMessage: 'Do you want to share :company\'s fundraise with your :network network?',
    };

    this.__initData(model);
  }

  __initData(model) {

    const companyName = model.short_name || model.name || '';

    this.data = {
      minInvestment: (model && model.campaign && model.campaign.minimum_increment)
        ? model.campaign.minimum_increment
        : 100,
      title: this._format('title', { company: companyName, siteName: this.data.siteName }),
      url: `${window.location.origin}/${model.slug || model.id}`,
      description: model.description,
      companyName: companyName,
      corporateStructure: CORPORATE_STRUCTURE[model.corporate_structure] || '',
      picture: model.campaign.getMainImage()
    };
  }

  facebook() {
    return 'https://www.facebook.com/dialog/share' +
      '?app_id=' + app.config.facebookClientId + '&href='  
      + encodeURIComponent('https://share.growthfountain.com/share?url=' + 
          encodeURIComponent(window.location.href) + '&t=' + this.data.title
    )
  }

  twitter() {
    return 'https://twitter.com/share' +
        '?url=' + this.data.url +
        '&text=' + encodeURIComponent(this._format('title', {
          company: this.data.companyName,
          siteName: '@GrowthFountain'
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
        '?subject=' + this.data.title +
        '&body=' + this._format('emailBody', {
          company: this.data.companyName,
          siteName: this.data.siteName,
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

module.exports = CampaignInfoProvider;
