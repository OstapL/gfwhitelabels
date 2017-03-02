const mainContent = '#content';

class SsnBlock {

 constructor(view, options={}) {
   this.template = require('./templates/ssn.pug');

   this.view = view;

   return this;
 }

 render() {
   let html = this.template({
     fields: this.view.fields,
     user: this.view.model,
   });

   this.attachEvents();

   return html;
 }

 initPopover(selector) {
    let $control = null;

    $(mainContent).on('focus', selector, (e) => {
      if (!$control) {
        $control = $(selector);
        $control.popover({
          trigger: 'focus',
          placement(context, src) {
            $(context).addClass('ssn-popover');
            return 'top';
          },
          html: true,
          content(){
            return $('.profile').find('.popover-content-ssn ').html();
          }
        });
      }

      $control.popover('show');
    });

    $(mainContent).on('focusout', selector, (e) => {
      $control.popover('hide');
    });

    return $control;
  }

 attachEvents() {
   this.initPopover('#ssn');
   this.initPopover('#ssn_re');
 }

}

module.exports = (...options) => {
  return new SsnBlock(...options);
};