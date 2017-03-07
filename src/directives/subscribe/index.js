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
        alert('Check your email to proceed with your subscription.');
      }).fail((jqXHR, textStatus, errorThrown) => {
        //TODO: this is temporary solution
        alert('Check your email to proceed with your subscription.');
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
