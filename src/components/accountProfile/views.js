const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzoneHelpers.js');
const validation = require('components/validation/validation.js');
const phoneHelper = require('helpers/phoneHelper.js');
let countries = require('helpers/countries.js');

module.exports = {
  profile: Backbone.View.extend(_.extend({
    template: require('./templates/profile.pug'),
    urlRoot: authServer + '/rest-auth/data',
    events: _.extend({
      'submit form': 'submit',
      'focus #ssn' : 'showSSNPopover',
      'focuseout #ssn' : 'hideSSNPopover',
      'keyup #zip_code': 'changeZipCode',
      'change .js-city': 'changeAddressManually',
      'change .js-state': 'changeAddressManually',
      'change .country-select': 'changeCountry',
    }, phoneHelper.events, dropzoneHelpers.events),

    changeCountry(e) {
      let $target = $(e.target);
      let country = $target.val();
      if (country == 'us') {
        $('.foreign-country-row').hide();
        $('.foreign-country-row input').prop('disabled', true);
        $('.us-row').show();
        $('.us-row input').prop('disabled', false);
      } else {
        $('.foreign-country-row').show();
        $('.foreign-country-row input').prop('disabled', false);
        $('.us-row').hide();
        $('.us-row input').prop('disabled', true);
      }
    },

    initialize(options) {
      this.fields = options.fields;
      this.fields.image = { type: 'image' };

      this.fields.phone.required = true;
      this.fields.first_name.required = true;
      this.fields.last_name.required  = true;
      this.fields.country = { required: true, value: 'US' , label: 'Country'};
      this.fields.country.validate = {};
      this.fields.country.validate.choices = countries;
      this.fields.street_address_1 = { label: 'Street address 1', required: true };
      this.fields.street_address_2 = { label: 'Street address 2'};
      this.fields.zip_code.label = 'Zip code';

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
      this.usaStates = require("helpers/usa-states.js");

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: this.model,
          fields: this.fields,
          states: this.usaStates,
        })
      );
      setTimeout(() => { this.createDropzones() } , 1000);

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      this.zipCodeField = this.$('#zip_code');

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
    },

  }, phoneHelper.methods, dropzoneHelpers.methods)),

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

  issueDashboard: Backbone.View.extend({

    render(){
      const template = require('./templates/issuerDashboard.pug');

      this.$el.html(
        template({ })
      );

      const socket = require('socket.io-client')('http://localhost:3000');
      socket.on('connect', function () {
        socket.emit('newUser', app.user.id, function (data) {
          console.log(data); 
        });
      });
      socket.on('notification', function(msg){
        console.log(msg);
        $('.notification-container ul').append($('<li>').html('<a>' + msg + '</a>'));
      });
      return this;
    },
  }),

};
