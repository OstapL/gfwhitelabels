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
        type: 'POST',
        data: data,
        dataType: 'json',
      }).then((response) => {
        console.log(response);
        alert('Thank you for subscribing to our news letters');
      }).fail(() => {
        console.error('subscription failed');
        console.error(arguments);
      });
      console.log('subscribe');
      console.log(data);
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
