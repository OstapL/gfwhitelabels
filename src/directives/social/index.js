const mainContent = '#content';
function stripHtml(content) {
  if (!_.isString(content))
    return content;

  return content.replace(/(<([^>]+)>)/ig,"");
}

class SocialNetworks {
  constructor() {
    this.template = require('./templates/social.pug');

    this.data = {};

    this.__eventsAttached = false;

    return this;
  }

  attachEvents() {
    if (this.__eventsAttached)
      return;

    let $page = $('#page');
    $page.on('click', mainContent + ' .facebook-share', this.socialPopup.bind(this));
    $page.on('click', mainContent + ' .twitter-share', this.socialPopup.bind(this));
    $page.on('click', mainContent + ' .linkedin-share', this.shareLinkedin.bind(this));
    //default logic will work for sharing via mailto links
    // $page.on('click', mainContent + ' .email-share', this.socialPopup);

    this.__eventsAttached = true;
  }

  render(key, infoProvider) {
    this.data[key] = infoProvider;
    let html = this.template({
      key: key,
      info: infoProvider,
    });

    this.attachEvents();

    return html;
  }

  loginLinkedin () {
    return new Promise((resolve, reject) =>  {
      if (!window.IN) {
        return resolve(false);
      }

      IN.User.authorize(resolve);
    });
  }

  shareLinkedin (e) {
    e.preventDefault();

    let $linksContainer = $(e.target).closest('.social-links-container');
    let key = $linksContainer.data('key');

    const data = this.data[key].linkedin();

    this.loginLinkedin().then((res) => {
      if (res === false) {
        return;
      }

      let message = this.data[key].confirmationMessage();

      this.confirm($linksContainer, { title: 'confirm', message: message }).then((res) => {
        if (res)
          IN.API.Raw('/people/~/shares?format=json')
            .method('POST')
            .body(JSON.stringify(data))
            .result(() => {alert('You\'ve just shared the page to LinkedIn')})
            .error( console.log.bind(console, 'linkedin error: ') );
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  socialPopup(e) {
    e.preventDefault();

    let $linksContainer = $(e.target).closest('.social-links-container');
    let key = $linksContainer.data('key');

    let message = this.data[key].confirmationMessage();

    this.confirm($linksContainer, { title: 'confirm', message: message}).then((res) => {
      if (res)
        window.open(e.currentTarget.href, '', 'toolbar=0,status=0,left=45%,top=45%,width=626,height=436');
    });

    return false;
  }

  confirm(container, data) {
    return new Promise((resolve, reject) => {
      if (!data || !data.message)
        return resolve(true);

      let template = require('./templates/confirm.pug');
      let $container = $(container);

      let $modal = $(template(data));

      $modal.on('shown.bs.modal', () => {
        $modal.on('click', '.confirm-yes', () => {
          $modal.modal('hide');
          resolve(true);
        });

        $modal.on('click', '.confirm-no', () => {
          $modal.modal('hide');
          resolve(false)
        });
      });

      $modal.on('hidden.bs.modal', () => {
        $modal.off('hidden.bs.modal');
        $modal.off('show.bs.modal');
        $modal.off('click');
        $modal.remove();
      });

      $container.append($modal);

      $modal.modal('show');
    });
  }
}

let __instance = null;

function getInstance() {
  if (!__instance)
    __instance = new SocialNetworks();

  return __instance;
}

module.exports = getInstance();