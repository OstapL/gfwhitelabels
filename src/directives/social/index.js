const mainContent = '#content';
const campaignHelper = require('components/campaign/helpers.js');

class SocialNetworks {
  constructor(company) {
    this.template = require('./templates/social.pug');

    this.model = company;

    const companyName = this.model.short_name || this.model.name || '';
    const url = window.location.origin + '/' + this.model.id;

    this.data = {
      url: url,
      title: 'Check out ' + companyName + '\'s fundraise on GrowthFountain.com',
      description: this.model.description || '',
      caption: this.model.campaign.caption || '',
      picture: campaignHelper.getImageCampaign(this.model.campaign),
      text: 'Check out ' + companyName + '\'s fundraise on @growthfountain '
    };

    this.shareLinks = {
      facebook: this.getFacebookLink(this.data),
      twitter: this.getTwitterLink(this.data),
      linkedin: this.getLinkedinLink(this.data),
      mailTo: this.getMailToLink(this.data),
      google_plus: this.getGooglePlusLink(this.data),
    };

    return this;
  }

  attachEvents() {

    let $mainContent = $(mainContent);

    $mainContent.on('click', '.facebook-share', this.socialPopup.bind(this));

    $mainContent.on('click', '.twitter-share', this.socialPopup.bind(this));

    $mainContent.on('click', '.linkedin-share', this.shareLinkedin.bind(this));

    $mainContent.on('click', '.email-share', this.socialPopup.bind(this));
  }

  render() {
    let html = this.template({
      links: this.shareLinks,
    });

    this.attachEvents();

    return html;
  }

  loginLinkedin () {
    const promise = new Promise( (resolve, reject) => IN.User.authorize(resolve) );
    return promise;
  }

  shareLinkedin (e) {
    e.preventDefault();

    const payload = {
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

    this.loginLinkedin().then((res) => {
      IN.API.Raw('/people/~/shares?format=json')
      .method('POST')
      .body(JSON.stringify(payload))
      .result( console.log.bind(console, 'linkedin success: ') )
      .error( console.log.bind(console, 'linkedin error: ') );
    })

  }

  socialPopup(e) {
    e.preventDefault();

    var popupOpt = e.currentTarget.dataset.popupOpt || 'toolbar=0,status=0,left=45%,top=45%,width=626,height=436';
    var windowChild = window.open(e.currentTarget.href, '', popupOpt);

    if (e.currentTarget.dataset.close) {
      let closeScript = "<script>setTimeout(window.close.bind(window), 400);</script>";
      windowChild.document.write(closeScript);
    }

    return false;
  }

  //{ url, text }
  getTwitterLink(values) {
    return 'https://twitter.com/share' +
              '?url=' + values.url +
              '&text=' + values.text;
  }

  //{ app_id, url, description, locale, picture, title, caption }
  getFacebookLink(values) {
    return 'https://www.facebook.com/dialog/share' +
              '?app_id=' + facebookClientId +
              '&href=' + values.url + '?r=' + Math.random() +
              '&description=' + (values.description || '') +
              '&locale=en_US' +
              '&picture=' + values.picture +
              '&title=' + (values.title || '') +
              '&caption=' + (values.caption || '');
  }

  //{ url, title, description || summary, source }
  getLinkedinLink(values) {
    return "#";
    // return 'https://www.linkedin.com/shareArticle' +
    //           '?mini=true' +
    //           '&url=' + values.url +
    //           '&title=' + values.title +
    //           '&summary=' + values.description +
    //           '&source=Growth Fountain';
  }

  //{ subject, text }
  getMailToLink(values) {
    return 'mailto:' +
              '?subject=' + values.title +
              '&body=' + (values.title + '%0D%0A') + values.url;
  }

  getGooglePlusLink(values) {
    return "#";
  }
}

module.exports = (...args) => {
  return new SocialNetworks(...args)
};