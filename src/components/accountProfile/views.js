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
  campaign: require('components/campaign/helpers.js'),
};

const moment = require('moment');

const FINANCIAL_INFORMATION = require('consts/financialInformation.json');

import 'bootstrap-slider/dist/bootstrap-slider';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';

module.exports = {
  profile: Backbone.View.extend(_.extend({
    template: require('./templates/profile.pug'),
    urlRoot: authServer + '/rest-auth/data',
    doNotExtendModel: true,
    events: _.extend({
      'click #save-account-info': 'saveAccountInfo',
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
            cssClass: 'img-profile-crop',
            preview: true,
          },
          auto: {
            width: 600,
            height: 600,
          },
        },
      });

      this.fields.account_number = {
        type: 'password',
        required: true,
        minLength: 5,
        dependies: ['account_number_re'],
        fn: function (name, value, attr, data, schema) {
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
        fn: function (name, value, attr, data, schema) {
          if (value != this.getData(data, 'account_number')) {
            throw "Account number fields don't match.";
          }
        },
      };

      this.fields.routing_number = {
        required: true,
        _length: 9,
        dependies: ['routing_number_re'],
        fn: function (name, value, attr, data, computed) {
          if (value != data.routing_number_re) {
            throw "Routing number fields don't match.";
          }
        },
      };

      this.fields.routing_number_re = {
        required: true,
        _length: 9,
        dependies: ['routing_number'],
        fn: function (name, value, attr, data, computed) {
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
        fn: function (name, value, attr, data, computed) {
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
        fn: function (name, value, attr, data, computed) {
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
        account_number_re: 'Re-enter Account Number',
        routing_number: 'Routing Number',
        routing_number_re: 'Re-enter Routing Number',
        annual_income: 'My Annual Income',
        net_worth: 'My Net Worth',
        twitter: 'Your Twitter Link',
        facebook: 'Your Facebook Link',
        instagram: 'Your Instagram Link',
        linkedin: 'Your LinkedIn Link',
        bank_name: 'Bank Name',
        name_on_bank_account: 'Name on Bank Account',
        ssn: 'Social Security Number (SSN) or Tax ID (ITIN/EIN)',
        ssn_re: 'Re-enter SSN',
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

      setTimeout(() => {
        this.createDropzones();
      }, 1000);

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

    saveAccountInfo(e) {
      //validate link fields if they have value
      const linkFields = ['twitter', 'facebook', 'instagram', 'linkedin'];
      let fields = {};
      let data = {};

      _.each(linkFields, (name) => {
        let field = this.$('#' + name);
        if (field.val()) {
          fields[name] = _.extend({}, this.fields[name], { type: 'url' });
          data[name] = field.val();
        }
      });
      this.$('.help-block').remove();
      if (!validation.validate(fields, data)) {
        e.preventDefault();

        _(validation.errors).each((errors, key) => {
          validation.invalidMsg(this, key, errors);
        });

        return false;
      }

      api.submitAction.call(this, e);
    },

    _initSliders() {
      let cbInvestor1m = this.$('.investor-1m');
      let cbInvestor200k = this.$('.investor-200k');

      this.$('.slider-net-worth').bootstrapSlider({
        ticks: [0, 50, 100, 200, 500, 1000, 2000, 5000],
        ticks_positions: [0, 14, 28, 42, 56, 70, 85, 100],
        ticks_labels: ['$0', '$50K', '$100K', '$200K', '$500K', '$1M', '$2M', '$5M+'],
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
          return '$' + value + 'K';
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
      let firstName = this.el.querySelector('#first_name').value;
      let lastName = this.el.querySelector('#last_name').value;
      let fullName = firstName + lastName;

      if (app.user.first_name == firstName && app.user.last_name == lastName)
        return;

      app.user.first_name = firstName;
      app.user.last_name = lastName;

      //TODO: move this code to user.js
      let userData = app.user.toJSON();
      localStorage.setItem('user', JSON.stringify(userData));

      $('#user_name').text(fullName);
      $('.image_image_id').siblings('h3').text(fullName);
    },

    _success(data) {
      this._updateUserInfo();

      app.routers.navigate('/', { trigger: true });
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
      app.user.passwordChanged(data.key);
      return '/account/profile';
    },

    render() {
      let template = require('./templates/changePassword.pug');
      this.$el.html(template({}));
      return this;
    },
  }),

  setNewPassword: Backbone.View.extend({
    urlRoot: authServer + '/reset-password/do',
    events: {
      'submit form': api.submitAction,
    },

    getSuccessUrl(data) {
      return '/account/profile';
    },

    render() {
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

      _.each(this.model.data, helpers.campaign.initInvestment);

      this.snippets = {
        investment: require('./templates/investment.pug'),
      };
    },

    render() {
      this.$el.html(this.template({
        investments: this.model.data,
        snippets: this.snippets,
      }));
    },

    openAgreement(e) {
      e.preventDefault();
      const PARTICIPATION_AGREEMENT_ID = 2;
      const objectId = e.target.dataset.objectId;
      const securityType = e.target.dataset.securityType;
      const subscriptionAgreementLink =
        userDocuments.getUserDocumentsByType(objectId, securityType);
      const participationAgreementLink =
        userDocuments.getUserDocumentsByType(objectId, PARTICIPATION_AGREEMENT_ID);

      const data = {
        title: 'Agreements',
        files: [
          {
            mime: 'application/pdf',
            name: 'Subscription Agreement.pdf',
            urls: [subscriptionAgreementLink],
          }, {
            mime: 'application/pdf',
            name: 'Participation Agreement.pdf',
            urls: [participationAgreementLink],
          },
        ],
      };

      helpers.fileList.show(data);
    },

    _findInvestment(id) {
      return _.find(this.model.data, inv => inv.id == id);
    },

    showFinancialDocs(e) {
      e.preventDefault();

      const activeCompaign = this._findInvestment(e.target.dataset.id);
      const fiscalPriorGroupData = activeCompaign.formc.fiscal_prior_group_data;
      const fiscalRecentGroupData = activeCompaign.formc.fiscal_recent_group_data;
      const financialDocs = fiscalPriorGroupData.concat(fiscalRecentGroupData);

      let data = {
        title: 'Financials',
        files: financialDocs,
      };

      helpers.fileList.show(data);
    },

    onCancel(investment) {
      _.each(this.model.data, (i) => {
        if (i.campaign_id != investment.campaign_id)
          return;

        i.campaign.amount_raised -= investment.amount;
        this.$('[data-investmentid=' + i.id + ']').replaceWith(this.snippets.investment(i));
      });
    },

    //TODO: sort investments in dom on historical tab after cancel investment
    cancelInvestment(e) {
      e.preventDefault();

      let $target = $(e.target);
      let id = $target.data('id');

      if (!id)
        return false;

      let investment = this._findInvestment(id);

      if (!investment)
        return console.error('Investment doesn\'t exist: ' + id);

      if (!confirm('Are you sure?'))
        return false;

      api.makeRequest(investmentServer + '/' + id + '/decline', 'PUT').done((response) => {
        investment.status = FINANCIAL_INFORMATION.INVESTMENT_STATUS.CancelledByUser;
        helpers.campaign.initInvestment(investment);

        $target.closest('.one_table').remove();

        let hasActiveInvestments = _.some(this.model.data, i => i.active);
        if (!hasActiveInvestments)
          $('#active .investor_table')
            .append(
              '<div role="alert" class="alert alert-warning">' +
              '<strong>You have no active investments</strong>' +
              '</div>');

        let historicalInvestmentsBlock = this.$el.find('#historical .investor_table');
        let historicalInvestmentElements = historicalInvestmentsBlock.find('.one_table');
        let cancelledInvestmentElem = this.snippets.investment(investment);

        if (historicalInvestmentElements.length) {
          //find investment to insert after it
          let block = _.find(historicalInvestmentElements, (elem) => {
            const investmentId = Number(elem.dataset.investmentid);
            return investmentId > investment.id;
          });
          if (block)
            $(block).after(cancelledInvestmentElem);
          else
            historicalInvestmentsBlock.prepend(cancelledInvestmentElem);
        } else {
          historicalInvestmentsBlock.empty();
          historicalInvestmentsBlock.append(cancelledInvestmentElem);
        }

        this.onCancel(investment);
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
        this.template({})
      );
      return this;
    },
  }),

  afterCompleteDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterCompleteFillingDashboard.pug'),

    render() {
      this.$el.html(
        this.template({})
      );
      return this;
    },
  }),

  afterFinalDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterFinalSubmitDashboard.pug'),

    render() {
      this.$el.html(
        this.template({})
      );
      return this;
    },
  }),

  afterSubmittingGovermentDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterSubmittingGovermentDashboard.pug'),

    render() {
      this.$el.html(
        this.template({})
      );
      return this;
    },
  }),

  issuerDashboard: Backbone.View.extend({
    template: require('./templates/issuerDashboard.pug'),
    events: {
      'click .cancel-campaign': 'cancelCampaign',
    },

    initialize(options) {
      this.company = options.company;
      this.model = this.company;
      this.campaign = options.campaign;
      this.formc = options.formc;
    },

    render() {
      this.$el.html(
        this.template({
          self: this,
          company: this.company,
          campaign: this.campaign,
          formc: this.formc,
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
        script.src = '/js/graph_data.js';
        $(document.head).append(script);
      } catch (err) {
        console.log(err);
      }

      return this;
    },

    cancelCampaign(e) {
      e.preventDefault();
      alert('Please, call us 646-759-8228');
    },

    initComments() {
      const View = require('components/comment/views.js');
      const urlComments = commentsServer + '/company/' + this.company.id;
      let optionsR = api.makeRequest(urlComments, 'OPTIONS');
      let dataR = api.makeRequest(urlComments);

      $.when(optionsR, dataR).done((options, data) => {
        data[0].id = this.company.id;
        data[0].owner_id = this.company.owner_id;

        let comments = new View.comments({
          model: data[0],
          fields: options[0].fields,
          allowQuestion: false,
          cssClass: 'col-xl-8 offset-xl-0',
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
