const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzone.js');
const validation = require('components/validation/validation.js');

module.exports = {
  profile: Backbone.View.extend({
    template: require('./templates/profile.pug'),
    urlRoot: serverUrl + Urls.rest_user_details(),
    events: {
      'submit form': 'submit',
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
      this.model.id = '';
    },

    render() {
      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = require("helpers/usa-states");
      let dropzone = require('dropzone');
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: this.model,
          fields: this.fields,
          states: this.usaStates,
          dropzoneHelpers: dropzoneHelpers
        })
      );

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      this.zipCodeField = this.$('#zip_code');

      dropzoneHelpers.createImageDropzone(
        dropzone,
        'image', 
        'avatars', '', 
        (data) => {
          app.user.save({
            image: data.file_id,
          }, {
            patch: true
          }).then((data) => {
            $('#user-thumbnail').attr(
              'src', 
              app.getThumbnail('55x55', data.image_data.thumbnails)
            );
            var r = _.extend(data, localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify(r));
          });
        }
      );
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

    submit(e) {

      this.$el.find('.alert').remove();
      e.preventDefault();

      var data = data || $(e.target).serializeJSON();

      let model = new Backbone.Model();
      model.urlRoot = this.urlRoot;
      model.set(data);
      model.set('id', '');

      if (model.isValid(true)) {
        app.showLoading();
        model.save().
          then((data) => {
            this.$el.find('.alert-warning').remove();
            $('.popover').popover('hide');
            $('#user_name').html(data.first_name + ' ' + data.last_name);

            var r = _.extend(data, localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify(r));
            //$('#content').scrollTo();
            app.hideLoading();
          }).
          fail((xhr, status, text) => {
            api.errorAction(this, xhr, status, text, this.fields);
          });
      } else {
        if (this.$('.alert').length) {
          $('#content').scrollTo();
        } else {
          this.$el.find('.has-error').scrollTo();
        }
      }
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
      // if not 5 digit, return
      if (e.target.value.length < 5) return;
      if (!e.target.value.match(/\d{5}/)) return;
      this.getCityStateByZipCode(e.target.value, ({ success=false, city='', state='' }) => {
        // this.zipCodeField.closest('div').find('.help-block').remove();
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          // this.$('#city').val(city);
          this.$('.js-city').val(city);
          $('form input[name=city]').val(city);
          // this.$('#state').val(city);
          this.$('.js-state').val(state);
          $('form input[name=state]').val(state);

        } else {
          console.log('error');
        }
      });
    },

    resetAddressValues() {
      this.cityStateArea.text('City/State');
      this.cityField.val('');
      this.stateField.val('');
      validation.invalidMsg(this, 'zip_code', 'Sorry your zip code is not found');
    },

    changeAddressManually() {
      this.cityStateArea.text(`${this.cityField.val()}/${this.stateField.val()}`);
    }
  }),

  changePassword: Backbone.View.extend({
    urlRoot: serverUrl + Urls.rest_password_change(),
    events: {
      'submit form': api.submitAction,
    },
    getSuccessUrl(data) {
      return '/account/profile';
    },
    render(){
      let template = require('./templates/changePassword.pug');
      this.$el.html(template({}));
      return this;
    }
  }),

  setNewPassword: Backbone.View.extend({
    urlRoot: serverUrl + Urls.rest_password_reset_confirm(),
    events: {
        'submit form': api.submitAction,
    },

    getSuccessUrl(data) {
      return '/account/profile';
    },

    /*_success(data) {
      // Do the login in here too.
    },*/

    render(){
      const params = app.getParams();
      let template = require('./templates/setNewPassword.pug');
      this.$el.html(template({
        uid: params.uid,
        token: params.token,
      }));
      return this;
    },
  }),
};
