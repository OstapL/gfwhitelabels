const validation = require('components/validation/validation.js');
const userDocuments = require('helpers/userDocuments.js');

const helpers = {
  date: require('helpers/dateHelper.js'),
  format: require('helpers/formatHelper.js'),
  phone: require('helpers/phoneHelper.js'),
  social: require('helpers/socialNetworksHelper.js'),
  dropzone: require('helpers/dropzoneHelpers.js'),
  yesNo: require('helpers/yesNoHelper.js'),
  fields: require('./fields.js'),
};

// const InvestmentStatus = {
//   New: 0,
//   Approved: 1,
//   CanceledByClient: 2,
//   CanceledByBank: 3,
//   CanceledByInkvisitor: 4,
// };

const activeStatuses = [0, 1];
const canceledStatuses = [2, 3, 4];

let countries = {};
_.each(require('helpers/countries.json'), (c) => { countries[c.code] = c.name; });

import 'bootstrap-slider/dist/bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'


module.exports = {
  profile: Backbone.View.extend(_.extend({
    template: require('./templates/profile.pug'),
    urlRoot: authServer + '/rest-auth/data',
    doNotExtendModel: true,
    events: _.extend({
      'click #save-account-info': api.submitAction,
      'click #save-financial-info': api.submitAction,
      'change #not-qualify': 'changeQualify',
      'change .investor-item-checkbox': 'changeAccreditedInvestorItem',
      'change #twitter,#facebook,#instagram,#linkedin': 'appendHttpsIfNecessary',
      // 'change input[name=accredited_investor]': 'changeAccreditedInvestor',
    }, helpers.phone.events, helpers.dropzone.events, helpers.yesNo.events),

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

    initialize(options) {
      this.fields = options.fields;

      this.fields.image_image_id = _.extend(this.fields.image_image_id, {
        crop: {
          control: {
            aspectRatio: 1 / 1,
          },
          cropper: {
            cssClass : 'img-profile-crop',
            preview: true,
          },
          auto: {
            width: 600,
            height: 600,
          }
        },

        // imgOptions: {
        //   aspectRatio: 1 / 1,
        //   cssClass : 'img-profile-crop',
        //   showPreview: true,
        // },
      });

      // this.fields.account_number.required = true;
      this.fields.account_number = _.extend(this.fields.account_number, {
        type: 'password',
        fn: function(value, attr, fn, model, computed) {
          if (this.account_number != this.account_number_re)
            throw `Account number fields don't match`;
        },
      });

      this.model.account_number_re = this.model.account_number;
      this.fields.account_number_re = {
        type: 'password',
        fn: function(value, attr, fn, model, computed) {
          if (this.account_number != this.account_number_re)
            throw `Account number fields don't match`;
        },
      };

      this.fields.ssn = _.extend(this.fields.ssn, {
        type: 'password',
        fn: function(value, attr, fn, model, computed) {
          if (this.ssn != this.ssn_re)
            throw `Social security fields don't match`;
        },
      });

      this.model.ssn_re = this.model.ssn;
      this.fields.ssn_re = _.extend(this.fields.ssn_re = {}, {
        type: 'password',
        fn: function(value, attr, fn, model, computed) {
          if (this.ssn != this.ssn_re)
            throw `Social security fields don't match`;
        },

      });

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
        twitter: 'Your Twitter link',
        facebook: 'Your Facebook link',
        instagram: 'Your Instagram link',
        linkedin: 'Your LinkedIn link',
        bank_name: 'Bank Name',
        name_on_bank_account: 'Name on Bank Account',
        ssn: 'Social Security number (SSN) or Tax ID (ITIN/EIN)',
        ssn_re: 'Re-enter',
      };

      this.assignLabels();

      // define ui elements
      this.cityStateArea = null;
      this.cityField = null;
      this.stateField = null;
    },

    render() {
      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = require("helpers/usaStates.js");

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: this.model,
          roleInfo: app.user.getRoleInfo(),
          company: app.user.get('company'),
          fields: this.fields,
          states: this.usaStates,
        })
      );

      this._initSliders();

      setTimeout(() => { this.createDropzones() } , 1000);

      this.onImageCrop();

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');

      return this;
    },

    onImageCrop(name) {
      name = name || 'image_image_id';
      let dataFieldName = this._getDataFieldName(name);
      let data = this.model[dataFieldName][0];
      let url = data && data.urls ? data.urls[0] : null;
      if (url) {
        $('.user-info-name > span')
          .empty()
          .append('<img src="' + url + '" id="user-thumbnail"' + ' class="img-fluid img-circle">');
      }

    },

    onImageDelete(name) {
      $('.user-info-name > span').empty().append('<i class="fa fa-user">');
    },

    saveInfo(e) {
      let data = _.pick(this.model, ['image_image_id', 'image_data']);
      return api.submitAction.call(this, e, data);
    },

    appendHttpsIfNecessary(e) {
      helpers.format.appendHttpIfNecessary(e, true);
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
          cbInvestor1m.prop('checked', false).change();
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
          cbInvestor200k.prop('checked', false).change();
        }
        this.model.annual_income = e.value;
      });

      cbInvestor1m.prop('disabled', this.model.net_worth < 1000);
      cbInvestor200k.prop('disabled', this.model.annual_income < 200);

      this.$('a[href="#financial_info"]').on('show.bs.tab', (e) => {
        setTimeout(() => {
          this.$('.slider-net-worth').bootstrapSlider('setValue', this.model.net_worth);
          this.$('.slider-annual-income').bootstrapSlider('setValue', this.model.annual_income);
        }, 200);
      });
    },

    resetAddressValues() {
      this.cityStateArea.text('City/State');
      this.cityField.val('');
      this.stateField.val('');
      validation.invalidMsg(this, 'zip_code', 'Sorry your zip code is not found');
    },

    _success(data) {
      app.routers.navigate("/", {trigger: true});
      return 0;

      if ($("#financial_info").hasClass("active")) {
        app.routers.navigate("/", {trigger: true});
        return;
      }

      app.hideLoading();

      //todo: this is bad solution
      this.model.first_name = this.el.querySelector('#first_name').value;
      this.model.last_name = this.el.querySelector('#last_name').value;

      app.user.set('first_name', this.model.first_name);
      app.user.set('last_name', this.model.last_name);

      let userData = app.user.toJSON();

      localStorage.setItem('user', JSON.stringify(userData));
      // app.trigger('userLoaded', userData);
      let fullName = app.user.get('first_name') + ' ' + app.user.get('last_name');
      $('#user_name').text(fullName);
      $('.image_image_id').siblings('h3').text(fullName);

      $('#content').scrollTo();

      //switch to financial info tab
      // this.$('.profile-tabs a[href="#financial_info"]').tab('show');
    },

  }, helpers.phone.methods, helpers.dropzone.methods, helpers.yesNo.methods)),

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
    urlRoot: authServer + '/reset-password/do',
    events: {
        'submit form': api.submitAction,
    },

    getSuccessUrl(data) {
      return '/account/profile';
    },

    render(){
      let template = require('./templates/setNewPassword.pug');
      this.$el.html(template());
      return this;
    },
  }),

  InvestorDashboard: Backbone.View.extend({
    template: require('./templates/investorDashboard.pug'),
    el: '#content',
    events: {
      'click .cancel-investment': 'cancelInvestment',
      'click .agreement-link': 'openAgreement',
    },

    initialize(options) {
      this.fields = options.fields;

      this.investments = {
        active: [],
        historical: [],
      };

      let today = new Date();

      _.each(this.model.data, (i) => {
        i.created_date = new Date(i.created_date);
        i.campaign.expiration_date = new Date(i.campaign.expiration_date);

        if (_.contains(canceledStatuses, i.status) || i.campaign.expiration_date < today )
          this.investments.historical.push(i);
        else
          this.investments.active.push(i);
      });
    },

    render() {
      this.$el.html(this.template({
        investments: this.investments,
        helpers: helpers,
      }));
    },

    openAgreement(e) {
      const objectId = e.target.dataset.objectId;
      const securityType = e.target.dataset.securityType;
      const subscriptionAgreementLink = userDocuments.getUserDocumentsByType(objectId, securityType);
      e.target.href = subscriptionAgreementLink;
    },

    cancelInvestment(e) {
      e.preventDefault();

      let $target = $(e.target);
      let id = $target.data('id');

      if (!id)
        return false;

      let idx = _.findIndex(this.investments.active, (i) => {
        return i.id == id;
      });

      if (idx < 0)
        return console.error(`Investment doesn't exist: ${id}`);

      if (!confirm('Are you sure?'))
        return false;

      api.makeRequest(investmentServer + '/' + id + '/decline', 'PUT').done((response) => {
        console.log(response);
        let investment = this.investments.active.splice(idx, 1)[0];
        investment.status = 2;
        this.investments.historical.push(investment);

        $target.closest('.one_table').remove();

        if (this.investments.active.length <= 0)
          $('#active .investor_table')
            .append(
              '<div role="alert" class="alert alert-warning">' +
                '<strong>You have no active investments</strong>' +
              '</div>');

        let historicalInvestmentsBlock = this.$el.find('#historical .investor_table');

        if (this.investments.historical.length === 1)
          historicalInvestmentsBlock.empty();

        historicalInvestmentsBlock.append(helpers.fields.investment(investment, {}, helpers));

      }).fail((err) => {
        alert(err.error);
      });
    },
  }),

  companyDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/companyDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  }),
  companyDashboardFirst: Backbone.View.extend({
    el: '#content',
    template: require('./templates/companyDashboardFirst.pug'),

    render() {
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  }),
  afterPaymentDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterPaymentDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          
        })
      );
      return this;
    },
  }),
  afterCompleteDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterCompleteFillingDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          
        })
      );
      return this;
    },
  }),
  afterFinalDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterFinalSubmitDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          
        })
      );
      return this;
    },
  }),
  afterSubmittingGovermentDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterSubmittingGovermentDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          
        })
      );
      return this;
    },
  }),

  issuerDashboard: Backbone.View.extend({
    template: require('./templates/issuerDashboard.pug'),
    events: {
      'click .linkedin-share': 'shareOnLinkedIn',
      'click .facebook-share': 'shareOnFaceBook',
      'click .twitter-share': 'shareOnTwitter',
      'click .email-share': 'shareWithEmail',
      'click .google-plus-share': 'shareWithGooglePlus',
      'click .cancel-campaign': 'cancelCampaign',
    },

    initialize(options) {
      this.model.description = "Something long comes from here. Something long comes from here. Something long comes from here. Something long comes from here. Something long comes from here. ";
      this.model.thumbnail = '/img/smartbe-intelligent-stroller.jpg';
      this.model.campaign = _.extend({
        minimum_raise: 80000,
        amount_raised: 20000,
        starting_date: "2016-04-04",
        expiration_date: "2017-02-04",
        investors: 0,
        views: 0,
        interactions: 4567,
      }, this.model.campaign);

      this.company = options.company;

      helpers.social.init();
    },

    render(){
      this.$el.html(
        this.template({
          values: this.model,
          company: this.company,
          helpers: helpers,
        })
      );

      this.initComments();

      try {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/js/graph/graph.js';
        $(document.head).append(script);

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/js/graph_data.js'
        $(document.head).append(script);
      } catch(err){
        console.log(err);
      }



      // const socket = require('socket.io-client')('http://localhost:3000');
      // socket.on('connect', function () {
      //   socket.emit('newUser', app.user.id, function (data) {
      //     console.log(data);
      //   });
      // });
      // socket.on('notification', function(msg){
      //   console.log(msg);
      //   $('.notification-container ul').append($('<li>').html('<a>' + msg + '</a>'));
      // });
      return this;
    },

    shareOnLinkedIn(e) {
      e.preventDefault();

      helpers.social.linkedIn.share({
        href: 'http://growthfountain.com/' + this.model.id,
        title: this.model.name,
        description: this.model.description,
      });
    },

    shareOnFaceBook(e) {
      e.preventDefault();

      helpers.social.facebook.share({
        href: 'http://growthfountain.com/' + this.model.id,
        caption: this.model.tagline,
        title: this.model.name,
        description: this.model.description,
        picture: this.model.campaign.header_image_data[0].urls[0],
      });

    },

    shareOnTwitter(e) {
      e.preventDefault();

      helpers.social.twitter.share({
        href: 'http://growthfountain.com/' + this.model.id,
        hashtags: ['investment', 'fundraising'],
        text: 'Check out ',
      });
    },

    shareWithEmail(e) {
      e.preventDefault();

      let text = "Check out " + this.model.name + "'s fundraise on GrowthFountain";

      helpers.social.email.share({
        subject: text,
        message: text,
        href: 'http://growthfountain.com/' + this.model.id,
      });
    },

    shareWithGooglePlus(e) {
      e.preventDefault();

      helpers.social.googlePlus.share({
        href: 'http://growthfountain.com/' + this.model.id,
      });
    },

    cancelCampaign(e) {
      e.preventDefault();
      alert('Please, call us 646-759-8228');
    },

    initComments() {
      const View = require('components/comment/views.js');
      const urlComments = commentsServer + '/company/' + this.model.id;
      let optionsR = api.makeRequest(urlComments, 'OPTIONS');
      let dataR = api.makeRequest(urlComments);

      $.when(optionsR, dataR).done((options, data) => {
        data[0].id = this.model.id;
        data[0].owner_id = this.model.owner_id;

        let comments = new View.comments({
          model: data[0],
          fields: options[0].fields,
          allowQuestion: false,
          cssClass: 'col-lg-8',
        });
        comments.render();

        let commentsCount = 0;

        function countComments(comments) {
          commentsCount += comments.length;
          _.each(comments, (c) => {
            countComments(c.children);
          });
        }

        countComments(data[0].data);
        $('.interactions-count').text(commentsCount);
      });
    },
  }),

};
