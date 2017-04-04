const CORPORATE_STRUCTURE = require('consts/raisecapital/corporate_structure.json');
const campaignHelper = require('components/campaign/helpers.js');

const ShareInfoProvider = require('src/directives/social/infoProvider.js');
const titleTemplate = 'You want a piece of this!? Invest in :company: on :site:';
const emailBodyTemplate = 'Hi! I think you should check out :company:\'s fundraise on :site:. ' +
  'You now have the opportunity to own a piece of your favorite company for as little as $100.%0D%0A' +
  'Come take a look: ';

class CampaignInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);
    this.__initData(model);
  }

  __initData(model) {
    if (this.data)
      return;

    const companyName = model.short_name || model.name || '';
    const site = window.location.host.replace(/growthfountain/i, 'GrowthFountain')

    this.data = {
      title: titleTemplate.replace(':company:', companyName).replace(':site:', site),
      url: `${window.location.origin}/${model.slug || model.id}`,
      description: model.description,
      companyName: companyName,
      corporateStructure: CORPORATE_STRUCTURE[model.corporate_structure] || '',
      picture: campaignHelper.getImageCampaign(model.campaign),
      site: site,
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
        '?url=' + this.data.url +
        '&text=' + titleTemplate.replace(':company:', this.data.companyName)
                    .replace(':site:', '@GrowthFountain') + '%0D%0A';
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
        '&body=' + emailBodyTemplate.replace(':company:', this.data.companyName)
                    .replace(':site:', this.data.site) + this.data.url;
  }

  confirmationMessage(network) {
    return `Do you want to share ${this.data.companyName}'s fundraise with your ${network} network`;
  }
}

module.exports = CampaignInfoProvider;
