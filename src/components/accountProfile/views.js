const validation = require('components/validation/validation.js');
const userDocuments = require('helpers/userDocuments.js');

const disableEnterHelper = require('helpers/disableEnterHelper.js');

const helpers = {
  date: require('helpers/dateHelper.js'),
  format: require('helpers/formatHelper.js'),
  phone: require('helpers/phoneHelper.js'),
  dropzone: require('helpers/dropzoneHelpers.js'),
  yesNo: require('helpers/yesNoHelper.js'),
  fileList: require('helpers/fileList.js'),
};

const moment = require('moment');

const invest = require('consts/financialInformation.json');

const activeStatuses = [invest.investment_status.New, invest.investment_status.Approved];
const canceledStatuses = [invest.investment_status.CanceledByClient,
    invest.investment_status.CanceledByBank, invest.investment_status.CanceledByInquisitor];

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

    initialize(options) {
      this.activeTab = options.activeTab;

      this.fields = options.fields;

      this.fields.phone = _.extend(this.fields.phone, {
        required: true,
      });

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
      });

      this.fields.account_number = {
        type: 'password',
        required: true,
        minLength: 5,
        dependies: ['account_number_re'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'account_number_re')) {
            throw "Account number fields don't match.";
          }
        },
      };

      this.fields.account_number_re = {
        type: 'password',
        required: true,
        minLength: 5,
        dependies: ['account_number'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'account_number')) {
            throw "Account number fields don't match.";
          }
        },
      };

      this.fields.routing_number = {
        required: true,
        _length: 9,
        dependies: ['routing_number_re'],
        fn: function(name, value, attr, data, computed) {
          if (value != data.routing_number_re) {
            throw "Routing number fields don't match.";
          }
        },
      };

      this.fields.routing_number_re = {
        required: true,
        _length: 9,
        dependies: ['routing_number'],
        fn: function(name, value, attr, data, computed) {
          if (value != data.routing_number) {
            throw "Routing number fields don't match.";
          }
        },
      };

      this.fields.ssn = {
        type: 'password',
        required: true,
        _length: 9,
        dependies: ['ssn_re'],
        fn: function(name, value, attr, data, computed) {
          if (value != data.ssn_re) {
            throw "Social security fields don't match.";
          }
        },
      };

      this.fields.ssn_re = {
        type: 'password',
        required: true,
        _length: 9,
        dependies: ['ssn'],
        fn: function(name, value, attr, data, computed) {
          if (value != data.ssn) {
            throw "Social security fields don't match.";
          }
        },
      };

      this.model.account_number_re = this.model.account_number;
      this.model.routing_number_re = this.model.routing_number;
      this.model.ssn_re = this.model.ssn;

      this.labels = {
        country: 'Country',
        street_address_1: 'Street Address 1',
        street_address_2: 'Street Address 2',
        zip_code: 'Zip Code',
        state: 'State/Province/Region',
        city: 'City',
        phone: 'Phone',
        account_number: 'Account Number',
        account_number_re: 'Re-Enter Account Number',
        routing_number: 'Routing Number',
        routing_number_re: "Re-Enter Routing Number",
        annual_income: 'My Annual Income',
        net_worth: 'My Net Worth',
        twitter: 'Your Twitter Link',
        facebook: 'Your Facebook Link',
        instagram: 'Your Instagram Link',
        linkedin: 'Your LinkedIn Link',
        bank_name: 'Bank Name',
        name_on_bank_account: 'Name On Bank Account',
        ssn: 'Social Security Number (SSN) Or Tax ID (ITIN/EIN)',
        ssn_re: 'Re-enter',
      };

      this.assignLabels();

      // define ui elements
      this.cityStateArea = null;
      this.cityField = null;
      this.stateField = null;
    },

    render() {
      this.$el.html(
        this.template({
          tab: this.activeTab || 'account_info',
          serverUrl: serverUrl,
          user: this.model,
          company: app.user.get('company'),
          fields: this.fields,
        })
      );

      this._initSliders();

      setTimeout(() => { this.createDropzones() } , 1000);

      this.onImageCrop();

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      disableEnterHelper.disableEnter.call(this);

      return this;
    },

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

      // this.$('a[href="#financial_info"]').on('show.bs.tab', (e) => console.warn('!!!!!!!'));
      
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

    _updateUserInfo() {
      let first_name = this.el.querySelector('#first_name').value;
      let last_name = this.el.querySelector('#last_name').value;

      if (app.user.first_name == first_name && app.user.last_name == last_name)
        return;

      app.user.first_name = first_name;
      app.user.last_name = last_name;

      //TODO: move this code to user.js
      let userData = app.user.toJSON();
      localStorage.setItem('user', JSON.stringify(userData));

      let full_name = `${first_name} ${last_name}`;

      $('#user_name').text(full_name);
      $('.image_image_id').siblings('h3').text(full_name);
    },

    _success(data) {
      this._updateUserInfo();

      app.routers.navigate("/", {trigger: true});
      return 0;

      // if ($("#financial_info").hasClass("active")) {
      //   app.routers.navigate("/", {trigger: true});
      //   return;
      // }

    },

  }, helpers.phone.methods, helpers.dropzone.methods, helpers.yesNo.methods)),

  changePassword: Backbone.View.extend({
    urlRoot: authServer + '/rest-auth/password/change',
    events: {
      'submit form': api.submitAction,
    },
    getSuccessUrl(data) {
      localStorage.setItem('token', data.token);
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
      'click .financial-docs-link': 'showFinancialDocs',
    },

    initialize(options) {
      this.fields = options.fields;

      this.investments = {
        active: [],
        historical: [],
      };

      let today = moment.utc();

      _.each(this.model.data, (i) => {
        i.created_date = moment.parseZone(i.created_date);
        i.campaign.expiration_date = moment(i.campaign.expiration_date);

        if (_.contains(canceledStatuses, i.status) || i.campaign.expiration_date.isBefore(today))
          this.investments.historical.push(i);
        else
          this.investments.active.push(i);
      });

      this.snippets = {
        investment: require('./templates/investment.pug'),
      };
    },

    render() {
      this.$el.html(this.template({
        investments: this.investments,
        snippets: this.snippets,
      }));
    },

    openAgreement(e) {
      e.preventDefault();
      const PARTICIPATION_AGREEMENT_ID = 2;
      const objectId = e.target.dataset.objectId;
      const securityType = e.target.dataset.securityType;
      const subscriptionAgreementLink = userDocuments.getUserDocumentsByType(objectId, securityType);
      const participationAgreementLink = userDocuments.getUserDocumentsByType(objectId, PARTICIPATION_AGREEMENT_ID);

      const data = {
        title: 'Agreements',
        files: [{
          mime: 'application/pdf',
          name: 'Subscription Agreement.pdf',
          urls: [subscriptionAgreementLink]
        }, {
          mime: 'application/pdf',
          name: 'Participation Agreement.pdf',
          urls: [participationAgreementLink]
        }],
      };

      helpers.fileList.show(data);
    },

    _findInvestment(id) {
      return _.find(this.model.data, (inv) =>  {
        return inv.id == id;
      });
    },

    showFinancialDocs(e) {
      e.preventDefault();

      const activeCompaign = this._findInvestment(e.target.dataset.id);
      const fiscal_prior_group_data = activeCompaign.formc.fiscal_prior_group_data;
      const fiscal_recent_group_data =  activeCompaign.formc.fiscal_recent_group_data;
      const financialDocs = fiscal_prior_group_data.concat(fiscal_recent_group_data);

      let data = {
        title: 'Financials',
        files: financialDocs,
      };

      helpers.fileList.show(data);
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

        historicalInvestmentsBlock.append(this.snippets.investment({
          i: investment,
          attr: {},
        }));

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
      'click .email-share': 'socialPopup',
      'click .facebook-share': 'socialPopup',
      'click .twitter-share': 'socialPopup',
      'click .linkedin-share': 'shareLinkedin',
      'click .google-plus-share': 'socialPopup',
      'click .cancel-campaign': 'cancelCampaign',
    },

    initialize(options) {},

    render(){
      this.$el.html(
        this.template({
          values: this.model,
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

    loginLinkedin () {
      const promise = new Promise( (resolve, reject) => IN.User.authorize(resolve) );
      return promise;
    },

    shareLinkedin (e) {
      e.preventDefault();
      
      const payload = { 
        content: {
          'title': 'Check out ' + (this.model.short_name || this.model.name) + '\'s fundraise on GrowthFountain.com',
          'description': this.model.description,
          'submitted-url': window.location.origin + '/' + this.model.id,
          'submitted-image-url': campaignHelpers.getImageCampaign(this.model.campaign)
        }, 
        'visibility': { 
          'code': 'anyone'
        } 
      };
      
      this.loginLinkedin().then( res => {
        IN.API.Raw('/people/~/shares?format=json')
          .method('POST')
          .body(JSON.stringify(payload))
          .result( console.log.bind(console, 'linkedin success: ') )
          .error( console.log.bind(console, 'linkedin error: ') );
      })
      
    },
    
    socialPopup (e) {
      e.preventDefault();
      var popupOpt = e.currentTarget.dataset.popupOpt || 'toolbar=0,status=0,left=45%,top=45%,width=626,height=436';
      var windowChild = window.open(e.currentTarget.href, '', popupOpt);
   
      if (e.currentTarget.dataset.close) {
        let closeScript = "<script>setTimeout(window.close.bind(window), 400);</script>";
        windowChild.document.write(closeScript);
      }
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
