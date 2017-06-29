
class MailSubscriber {
  constructor() {
    this.template = require('./templates/subscribe.pug');
    this.eventsAttached = false;
  }

  attachEvents() {
    if (this.eventsAttached)
      return;

    $(document.body).on('submit', 'form.email-subscribe', (e) => {
      e.preventDefault();
      const $form = $(e.target).closest('form');
      const url = $form.attr('action');
      let data = $form.serializeJSON();
      //TODO: fix 'Access-Control-Allow-Origin' header is present on the requested resource.
      // Origin 'http://alpha.growthfountain.com:7070' is therefore not allowed access.
      $.ajax({
        url: url,
        data: data,
        dataType: 'jsonp',
      }).then((response) => {
        if (response.result == 'success') {
          app.dialogs.info(response.msg || 'Check your email to proceed with your subscription.');
          return;
        }
        app.dialogs.error(response.msg);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(errorThrown);
        app.dialogs.error('An error occurred, try again later.');
      });

      return false;
    });
  }

  render() {
    let html = this.template();
    this.attachEvents();
    return html;
  }

}

let __instance = null;

const getInstance = () => {
  if (!__instance)
    __instance = new MailSubscriber();

  return __instance;
};

module.exports = getInstance();
