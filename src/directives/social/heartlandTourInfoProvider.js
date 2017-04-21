const ShareInfoProvider = require('src/directives/social/infoProvider.js');

class HeartlandInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);

    this.templates = {
      title: 'Calling all successful entrepreneurs, startups and small businesses',
      emailBody: 'Companies can join GrowthFountain\'s Heartland Tour by pitching their ' +
        'product or service to thousands of people. Apply now for your chance to enter ' +
        'the Heartland Tour.',

      confirmationMessage: 'Do you want to share heartland page with your :network network?',
    };

    this.__initData(model);
  }

  __initData(model) {

    this.data = {
      title: this._format('title'),
      url: window.location.href,
      description: 'Companies can join GrowthFountain\'s Heartland Tour by pitching their ' +
      'product or service to thousands of people. Apply now for your chance to enter ' +
      'the Heartland Tour.',
      picture: window.location.origin + require('images/heartland-tour.jpg'),
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
      '?url=' + this.data.url +
      '&text=' + this._format('title') + '%0D%0A';
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
      '&description=' + this._stripHtml(this.data.description) +
      '&locale=' + 'en_US' +
      '&picture=' + this.data.picture +
      '&title=' + this.data.title +
      '&caption=' + window.location.host.toUpperCase();
  }

  email() {
    return 'mailto:' +
      '?subject=' + this.data.title +
      '&body=' + this._format('emailBody');
  }

  confirmationMessage(network) {
    return this._format('confirmationMessage', {
      network,
    });
  }
}

module.exports = HeartlandInfoProvider;
