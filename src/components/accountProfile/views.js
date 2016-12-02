const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzoneHelpers.js');
const validation = require('components/validation/validation.js');
const phoneHelper = require('helpers/phoneHelper.js');
const formatHelper = require('helpers/formatHelper');
const yesNoHelper = require('helpers/yesNoHelper.js');

let countries = {};
_.each(require('helpers/countries.json'), (c) => { countries[c.code] = c.name; });

import 'bootstrap-slider/dist/bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'


module.exports = {
  profile: Backbone.View.extend(_.extend({
    template: require('./templates/profile.pug'),
    urlRoot: authServer + '/rest-auth/data',
    events: _.extend({
      'submit form': api.submitAction,
      'focus #ssn' : 'showSSNPopover',
      'focuseout #ssn' : 'hideSSNPopover',
      'keyup #zip_code': 'changeZipCode',
      'change .js-city': 'changeAddressManually',
      'change .js-state': 'changeAddressManually',
      'change #country': 'changeCountry',
      'change #not-qualify': 'changeQualify',
      'change .investor-item-checkbox': 'changeAccreditedInvestorItem',
    }, phoneHelper.events, dropzoneHelpers.events, yesNoHelper.events),

    changeAccreditedInvestorItem(e) {
      let $target = $(e.target);
      let name = $target.data('name');
      let checked = $target.prop('checked');
      this.$('input[name=' + name + ']').val(checked);
      if (checked) {
        this.$('#not-qualify').prop('checked', false).change();
      }
    },

    changeQualify(e) {
      let $target = $(e.target);
      if ($target.prop('checked')) {
        this.$('.investor-item-checkbox').prop('checked', false).change();

        this.$('input[name=accredited_investor_choice]').val(false);
      } else {
        this.$('input[name=accredited_investor_choice]').val(true);
      }
    },

    changeCountry(e) {
      const usClass1 = 'col-lg-6 text-lg-right text-xs-left ';
      const usClass2 = 'col-lg-6 ';
      const foreignClass1 = 'col-lg-5 text-xl-right text-lg-left ';
      const foreignClass2 = 'col-lg-7 ';

      let $target = $(e.target);
      let country = $target.val();

      let $foreignCountryRow = $('.foreign-country-row');
      let $foreignCountryPhoneContainer = $foreignCountryRow.find('.foreign-country-phone');
      let $foreignCountryPhoneField = $foreignCountryPhoneContainer.find('.phone');

      let $usRow = $('.us-row');
      let $usPhoneContainer = $usRow.find('.us-phone');
      let $usPhonePhoneField = $usPhoneContainer.find('.phone');

      if (country == 'US') {
        $foreignCountryRow.hide();
        $foreignCountryPhoneField.appendTo($usPhoneContainer);

        $foreignCountryPhoneField.find('label')
          .removeClass(foreignClass1)
          .addClass(usClass1);

        $foreignCountryPhoneField.find('div')
          .removeClass(foreignClass2)
          .addClass(usClass2);

        $usRow.show();
      } else {
        $usRow.hide();
        $usPhonePhoneField.appendTo($foreignCountryPhoneContainer);

        $usPhonePhoneField.find('label')
          .removeClass(usClass1)
          .addClass(foreignClass1);

        $usPhonePhoneField.find('div')
          .removeClass(usClass2)
          .addClass(foreignClass2);

        $foreignCountryRow.show();
      }
    },

    initialize(options) {
      this.fields = options.fields;
      this.fields.image = { type: 'image' };
      this.fields.image.imgOptions = {
        aspectRatio: 1 / 1,
        cssClass : 'img-profile-crop',
        showPreview: true,
      };

      /*
      this.fields.phone.required = true;
      this.fields.first_name.required = true;
      this.fields.last_name.required  = true;
      */
      this.fields.country = {};
      this.fields.country.validate = { choices: countries };
      this.fields.account_number.required = true;
      this.fields.account_number_re = { required: true };
      /*
      this.fields.street_address_1 = { required: true };
      this.fields.street_address_2 = {};
      this.fields.twitter = {};
      this.fields.facebook = {};
      this.fields.instagram = {};
      this.fields.linkedin = {};
      this.fields.bank_name.required = true;
      this.fields.name_on_bank_account.required = true;
      this.fields.account_number.required = true;
      this.fields.account_number_re = { required: true };
      this.fields.routing_number.required = true;
      this.fields.account_type = { requried: true };
      this.fields.annual_income = { required: true };
      this.fields.net_worth.required = true;
      this.fields.accredited_investor = {};
      */

      this.labels = {
        country: 'Country',
        street_address_1: 'Street address 1',
        street_address_2: 'Street address 2',
        zip_code: 'Zip code',
        state: 'State/Province/Region',
        city: 'City',
        phone: 'Phone',
        account_number: 'Account Number',
        account_number_re: 'Re-Enter Account Number',
        routing_number: 'Routing Number',
        annual_income: 'My Annual Income',
        net_worth: 'My Net Worth',
        twitter: 'Twitter',
        facebook: 'Facebook',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        bank_name: 'Bank Name',
        name_on_bank_account: 'Name on Bank Account',
      };

      this.assignLabels();

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
      this.model.country = 'US';
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

      this._initSliders();
      setTimeout(() => { this.createDropzones() } , 1000);

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      this.zipCodeField = this.$('#zip_code');

      return this;
    },

    _initSliders() {
      let cbInvestor1m = this.$('.investor-1m');
      let cbInvestor200k = this.$('.investor-200k');

      this.$('.slider-net-worth').bootstrapSlider({
        ticks: [0, 50, 100, 200, 500, 1000, 2000, 5000],
        ticks_positions: [0, 14, 28, 42, 56, 70, 85, 100],
        ticks_labels: ['$0', '$50K', '$100K', '$200K', '$500K' , '$1M', '$2M', '$5M+'],
        ticks_snap_bounds: 1,
        formatter(value) {
          return value < 1000
            ? ('$' + value + 'K')
            : ('$' + (value / 1000).toFixed(1) + 'M');
        },

      }).on('slideStop', (e) => {
        cbInvestor1m.prop('disabled', e.value < 1000);
        if (e.value < 1000) {
          cbInvestor1m.prop('checked', false);
        }
        this.model.net_worth = e.value;
      });

      this.$('.slider-annual-income').bootstrapSlider({
        ticks: [0, 50, 100, 200, 500],
        ticks_positions: [0, 25, 50, 75, 100],
        ticks_labels: ['$0', '$50K', '$100K', '$200K', '$500K+'],
        ticks_snap_bounds: 1,
        formatter(value) {
          return '$' + value + 'K'
        },

      }).on('slideStop', (e) => {
        cbInvestor200k.prop('disabled', e.value < 200);
        if (e.value < 200) {
          cbInvestor200k.prop('checked', false);
        }
        this.model.annual_income = e.value;
      });

      //todo: disable checkboxes according to initial values

      cbInvestor1m.prop('disabled', this.model.net_worth < 1000);
      cbInvestor200k.prop('disabled', this.model.annual_income < 200);
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

    _success(data) {
      app.hideLoading();
    },

  }, phoneHelper.methods, dropzoneHelpers.methods, yesNoHelper.methods)),

  changePassword: Backbone.View.extend({
    urlRoot: authServer + '/rest-auth/password/change',
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
    urlRoot: authServer + Urls.rest_password_reset_confirm(),
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
    initialize(options) {
      this.model.description = "Something long comes from here. Something long comes from here. Something long comes from here. Something long comes from here. Something long comes from here. ";
      this.model.thumbnail = '/img/smartbe-intelligent-stroller.jpg',
      this.model.campaign = {
        minimum_raise: 80000,
        amount_raised: 20000,
        starting_date: "2016-04-04",
        expiration_date: "2017-02-04",
        investors: 333,
        views: 123456,
        interactions: 4567,
      }
    },
    events: {
      'click .linkedin-share': 'shareOnLinkedIn',
      'click .facebook-share': 'shareOnFaceBook',
      'click .twitter-share': 'shareOnTwitter',
      'click .email-share': 'shareWithEmail',
      'click .google-plus-share': 'shareWithGooglePlus',
    },

    shareOnLinkedIn(e) {
      event.preventDefault();
      window.open(encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + 'http://growthfountain.com/' + this.model.id +
        '&title=' + this.model.name +
        '&summary=' + this.model.description +
        '&source=Growth Fountain'),'Growth Fountain Campaign','width=605,height=545');
    },

    shareOnFaceBook(e) {
      event.preventDefault();
      FB.ui({
        method: 'share',
        href: 'http://growthfountain.com/' + this.model.id,
        caption: this.model.tagline,
        description: this.model.description,
        title: this.model.name,
        picture: null,
      }, function(response){});
    },

    shareOnTwitter(e) {
      event.preventDefault();
      window.open(encodeURI('https://twitter.com/share?url=' + 'http://growthfountain.com/' + this.model.id +
        '&via=' + 'growthfountain' +
        '&hashtags=investment,fundraising' +
        '&text=Check out '),'Growth Fountain Campaign','width=550,height=420');
    },

    shareWithEmail(e) {
      event.preventDefault();
      let companyName = this.model.name;
      let text = "Check out " + companyName + "'s fundraise on GrowthFountain";
      window.open("mailto:?subject=" + text + "&body=" + text + "%0D%0A" + 'http://growthfountain.com/' + this.model.id);
    },

    shareWithGooglePlus(e) {
      event.preventDefault();
    },

    render(){
      const socialMediaScripts = require('helpers/shareButtonHelper.js');
      const template = require('./templates/issuerDashboard.pug');

      this.$el.html(
        template({
          values: this.model,
          formatHelper: formatHelper,
        })
      );

      socialMediaScripts.facebook();

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
