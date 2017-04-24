const ShareInfoProvider = require('src/directives/social/infoProvider.js');

class HeartlandInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);

    this.templates = {
      subject: 'I thought you\'d be interested in :siteName\'s Heartland Tour',
      title: 'Calling all successful entrepreneurs, startups and small businesses',
      emailBody: 'Hi! I think you should check out :siteName\'s Heartland Tour. They\'re traveling ' +
        'across country on a quest for exciting companies that need to raise money to grow; ' +
        'from tech startups to the restaurants, bars and bricks %26 mortar locations across America.' +
        '%0D%0A%0D%0A' +
        ' I thought you might be interested in raising money or attending one of their live events!' +
        '%0D%0A%0D%0A' +
        'Come take a look: :url',
      description: 'Companies can join :siteName\'s Heartland Tour by pitching their ' +
        'product or service to thousands of people. Apply now for your chance to participate',
      confirmationMessage: 'Do you want to share heartland page with your :network network?',
    };

    this.__initData(model);
  }

  __initData(model) {

    this.data = {
      title: this._format('title'),
      url: window.location.href,
      picture: window.location.origin + require('images/heartland-tour.jpg'),
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
      '?url=' + this.data.url +
      '&text=' + this._format('title') + '%0D%0A@GrowthFountain%0D%0A';
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
      '&description=' + this._stripHtml(
        this._format('description', {
          siteName: this.data.siteName,
        })) +
      '&locale=' + 'en_US' +
      '&picture=' + this.data.picture +
      '&title=' + this.data.title +
      '&caption=' + window.location.host.toUpperCase();
  }

  email() {
    return 'mailto:' +
      '?subject=' + this._format('subject', {
        siteName: this.data.siteName,
      }) +
      '&body=' + this._format('description', {
        siteName: this.data.siteName,
      }) + '%0D%0A%0D%0A' + this.data.url;
  }

  nominateEmail() {
    return 'mailto:' +
      '?subject=' + this._format('subject', {
        siteName: this.data.siteName,
      }) +
      '&body=' + this._format('emailBody', {
        siteName: this.data.siteName,
        url: this.data.url,
      });
  }

  confirmationMessage(network) {
    return this._format('confirmationMessage', {
      network,
    });
  }
}

module.exports = HeartlandInfoProvider;
