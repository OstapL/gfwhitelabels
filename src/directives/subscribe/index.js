const removeHTMLFromMessage = (msg) => {
  msg = msg || '';
  return msg.replace(/(<(.+)>)/ig, '');
};

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
        app.routers.navigate('/subscription-thanks', { trigger: true, });
        // if (response.result == 'success') {
        //   app.dialogs.info(removeHTMLFromMessage(response.msg || 'Check your email to proceed with your subscription.'));
        //   $form.find('[type=email]').val('');
        //   return;
        // }
        // app.dialogs.error(removeHTMLFromMessage(response.msg));
      }).fail((jqXHR, textStatus, errorThrown) => {
        app.routers.navigate('/subscription-thanks', { trigger: true, });
        // console.error(errorThrown);
        // app.dialogs.error('An error occurred, try again later.');
      });
      
      app.analytics.emitEvent('EmailSubscription', data);
      
      return false;
    });

    this.eventsAttached = true;
  }

  render(options) {
    let html = this.template(options);
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
