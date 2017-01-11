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

 attachEvents() {
   $(mainContent).on('focus', '#ssn', (e) => {
     if (!this.$input) {

       this.$input = $('#ssn');

       this.$input.popover({
         trigger: 'focus',
         placement(context, src) {
           $(context).addClass('ssn-popover');
           return 'right';
         },
         html: true,
         content(){
           var content = $('.profile').find('.popover-content-ssn ').html();
           return content;
         }
       });
     }

     this.$input.popover('show');
   });

   $(mainContent).on('focusout', '#ssn', (e) => {
     this.$input.popover('hide');
   });
 }

}

module.exports = (...options) => {
  return new SsnBlock(...options);
};