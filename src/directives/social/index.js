const mainContent = '#content';
const campaignHelper = require('components/campaign/helpers.js');
const defaultOptions = {
  titlePrefix: 'Check out ',
  descriptionPrefix: '',
};

const CORPORATE_STRUCTURE = require('consts/raisecapital/corporate_structure.json');

function stripHtml(content) {
  if (!_.isString(content))
    return content;

  return content.replace(/(<([^>]+)>)/ig,"");
}

class SocialNetworks {
  constructor() {
    this.template = require('./templates/social.pug');

    this.__loadScripts();

    this.__eventsAttached = false;

    return this;
  }

  __loadScripts() {
    // let script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = '//platform.linkedin.com/in.js';
    // script.innerHTML = `
    //   api_key: '${linkedinClientId}
    //   authorize: true
    // `;
    // $(document.head).append(script);
  }

  attachEvents() {
    if (this.__eventsAttached)
      return;

    let $page = $('#page');
    $page.on('click', mainContent + ' .facebook-share', this.socialPopup);
    $page.on('click', mainContent + ' .twitter-share', this.socialPopup);
    $page.on('click', mainContent + ' .linkedin-share', this.shareLinkedin.bind(this));
    //default logic will work for sharing via mailto links
    // $page.on('click', mainContent + ' .email-share', this.socialPopup);

    this.__eventsAttached = true;
  }

  __initTemplateData(model={}, options={}) {
    options = _.extend({}, defaultOptions, options);

    const companyName = model.short_name || model.name || '';
    let corporateStructure = (CORPORATE_STRUCTURE[model.corporate_structure] || '');
    corporateStructure += corporateStructure ? ' ' : '';

    const data = {
      url: window.location.origin + '/' + model.id,
      title: stripHtml(options.titlePrefix + companyName + '\'s ' + corporateStructure + 'on GrowthFountain.com '),
      description: stripHtml(options.descriptionPrefix + (model.description || '')),
      picture: campaignHelper.getImageCampaign(model.campaign),
      text: stripHtml(options.titlePrefix + companyName + '\'s ' + corporateStructure + 'on @growthfountain '),
    };

    return {
      links:  {
        facebook: this.getFacebookLink(data),
        twitter: this.getTwitterLink(data),
        linkedin: this.getLinkedinLink(data),
        mailTo: this.getMailToLink(data),
        google_plus: this.getGooglePlusLink(data),
      },
      data: data,
    };
  }

  render(...args) {
    let html = this.template(
      this.__initTemplateData(...args)
    );

    this.attachEvents();

    return html;
  }

  loginLinkedin () {
    return new Promise( (resolve, reject) => IN.User.authorize(resolve) );
  }

  shareLinkedin (e) {
    e.preventDefault();

    let $link = $(e.target).closest('a');

    const payload = {
      content: {
        'title': $link.data('title'),
        'description': $link.data('description'),
        'submitted-url': $link.data('url'),
        'submitted-image-url': $link.data('picture'),
      },
      'visibility': {
        'code': 'anyone'
      }
    };

    this.loginLinkedin().then((res) => {
      IN.API.Raw('/people/~/shares?format=json')
        .method('POST')
        .body(JSON.stringify(payload))
        .result(() => {alert('You\'ve just shared the page to LinkedIn')})
        .error( console.log.bind(console, 'linkedin error: ') );
    })

  }

  socialPopup(e) {
    e.preventDefault();

    window.open(e.currentTarget.href, '', 'toolbar=0,status=0,left=45%,top=45%,width=626,height=436');

    return false;
  }

  //{ url, text }
  getTwitterLink(values) {
    return 'https://twitter.com/share' +
              '?url=' + values.url +
              '&text=' + values.text;
  }

  //{ app_id, url, description, locale, picture, title }
  getFacebookLink(values) {
    return 'https://www.facebook.com/dialog/share' +
              '?app_id=' + facebookClientId +
              '&href=' + values.url + '?r=' + Math.random() +
              '&description=' + (values.description || '') +
              '&locale=en_US' +
              '&picture=' + values.picture +
              '&title=' + (values.title || '') +
              '&caption=' + window.location.host.toUpperCase();
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

let __instance = null;

function getInstance() {
  if (!__instance)
    __instance = new SocialNetworks();

  return __instance;
}

module.exports = getInstance();