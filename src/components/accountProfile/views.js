module.exports = {
  profile: Backbone.View.extend({
    template: require('./templates/profile.pug'),
    events: {
      'submit form': api.submitAction,
      'focus #ssn' : 'showSSNPopover',
      'focuseout #ssn' : 'hideSSNPopover',
      'keyup #zip_code': 'changeZipCode',
      'change .js-city': 'changeAddressManually',
      'change .js-state': 'changeAddressManually'
    },

    initialize(options) {
      this.fields = options.fields;

      // define ui elements
      this.cityStateArea = null;
      this.cityField = null;
      this.stateField = null;
      this.zipCodeField = null;

      // define timeout for zip code keyup event
      this.zipCodeTimeOut = null;

      // define flag for the geocode function respond
      this.geocodeIsNotInProgress = true;
    },

    render() {
      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = require("helpers/usa-states");
      let dropzone = require('dropzone');
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: app.user.toJSON(),
          fields: this.fields,
          states: this.usaStates
        })
      );

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      this.zipCodeField = this.$('#zip_code');

      /*
         app.createFileDropzone(
         dropzone,
         'image', 
         'avatars', '', 
         (data) => {
         this.model.save({
         image: data.file_id,
         }, {
         patch: true
         }).then((model) => {
         localStorage.setItem('user', JSON.stringify(this.model.toJSON()));
         });
         }
         );
         */
      return this;
    },

    getSuccessUrl(data) {
      return '/account/profile';
    },

    showSSNPopover(event){
      $('#ssn').popover({
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

      $('#ssn').popover('show');
    },

    hideSSNPopover(event){
      $('#ssn').popover('hide');
    },

    changeZipCode(e) {
      if (!this.geocodeIsNotInProgress) return false;

      clearTimeout(this.zipCodeTimeOut);
      this.zipCodeTimeOut = setTimeout(() => {
        this.geocodeIsNotInProgress = false;
        this.getCityStateByZipCode(e.target.value, ({ success=false, city="", state="" }) => {
          this.geocodeIsNotInProgress = true;
          // clear error
          this.zipCodeField.closest('div').find('.help-block').remove();

                if (success) {
                    if (!this.usaStates.find((el) => el.name == state)) {
                        this.resetAddressValues();
                        return false;
                    }

                    this.cityStateArea.text(`${city}/${state}`);
                    this.cityField.val(city);
                    this.stateField.val(state);
                } else {
                    this.resetAddressValues();
                }
            });
        }, 200);
    },

    resetAddressValues() {
      this.cityStateArea.text('City/State');
      this.cityField.val('');
      this.stateField.val('');
      Backbone.Validation.callbacks.invalid(this, 'zip_code', 'Sorry your zip code is not found');
    },

    changeAddressManually() {
      this.cityStateArea.text(`${this.cityField.val()}/${this.stateField.val()}`);
    }
  }),

  changePassword: Backbone.View.extend({
    render(){
      let template = require('./templates/changePassword.pug');
      this.$el.html(template({}));
      return this;
    }
  }),

  setNewPassword: Backbone.View.extend({
    events: {
        'form submit': api.submitAction,
    },

    render(){
      let template = require('./templates/setNewPassword.pug');
      this.$el.html(template({}));
      return this;
    },
  }),
};
