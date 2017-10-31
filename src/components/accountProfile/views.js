
const InvestmentModel = require('src/models/investment.js');
const Image = require('src/models/image.js');

// ToDo
// Refactor, this consts shouden't be here
const FEES = require('consts/raisecapital/companyFees.json');

import 'bootstrap-slider/dist/bootstrap-slider';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';


module.exports = {
  profile: Backbone.View.extend(Object.assign({
    template: require('./templates/profile.pug'),
    urlRoot: app.config.authServer + '/rest-auth/data',
    doNotExtendModel: true,
    events: Object.assign({
      'click #saveAccountInfo': api.submitAction,
      // 'click #saveFinancialInfo': api.submitAction,
      'change #not-qualify': 'changeQualify',
      'change .investor-item-checkbox': 'changeAccreditedInvestorItem',
    },
    app.helpers.phone.events,
    app.helpers.yesNo.events,
    app.helpers.social.events,
    ),

    initialize(options) {
      this.activeTab = options.activeTab;
      this.model = options.model.data;

      this.fields = options.fields;

      this.fields.phone = Object.assign(this.fields.phone, {
        required: true,
      });

      this.fields.image_image_id = Object.assign(this.fields.image_image_id, {
        templateDropzone: 'profileDropzone.pug',
        defaultImage: require('images/default/Default_photo.png'),
        onSaved: (data) => {
          app.user.updateImage(data.file);
        },
        crop: {
          control:  {
            aspectRatio: 1 / 1,
          },
          auto: {
            width: 300,
            height: 300,
          },
          resize: {
            width: 50,
            height: 50,
          },
          cssClass: 'img-profile-crop',
          template: 'withpreview',
          templateImage: 'profileImage.pug'
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
        first_name: 'First Name',
        last_name: 'Last Name',
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
        name_on_bank_account: 'Name As It Appears on Bank Account',
        ssn: 'Social Security Number (SSN) or Tax ID (ITIN/EIN)',
        ssn_re: 'Re-enter SSN',
      };

      this.assignLabels();

      // define ui elements
      this.cityStateArea = null;
      this.cityField = null;
      this.stateField = null;

      this.listenToNavigate();
    },

    render() {
      this.$el.html(
        this.template({
          tab: this.activeTab || 'account_info',
          user: this.model,
          company: app.user.get('company'),
          fields: this.fields,
          view: this
        })
      );

      this.el.querySelector('#saveFinancialInfo').addEventListener('click', (e) => { api.submitAction.call(this, e)});

      this._initSliders();

      this.cityStateArea = this.$('.js-city-state');
      this.cityField = this.$('.js-city');
      this.stateField = this.$('.js-state');
      app.helpers.disableEnter.disableEnter.call(this);

      return this;
    },

    changeAccreditedInvestorItem(e) {
      let $target = $(e.target);
      let checked = $target.prop('checked');

      if (checked)
        this.$('#not-qualify').prop('checked', false);
    },

    changeQualify(e) {
      let $target = $(e.target);
      const notQualify = $target.prop('checked');
      if (notQualify) {
        this.$('.investor-item-checkbox').prop('checked', false);
      }
    },

    appendHttpsIfNecessary(e) {
      app.helpers.format.appendHttpIfNecessary(e, true);
    },

    saveAccountInfo(e) {
      //validate link fields if they have value
      let fields = {};
      let data = {};

      ['twitter', 'facebook', 'instagram', 'linkedin'].forEach((name) => {
        let field = this.$('#' + name);
        if (field.val()) {
          fields[name] = Object.assign({}, this.fields[name], { type: 'url' });
          data[name] = field.val();
        }
      });
      this.$('.help-block').remove();
      if (!app.validation.validate(fields, data)) {
        e.preventDefault();
        Object.keys(app.validation.errors).forEach((key) => {
          const errors = app.validation.errors[key];
          app.validation.invalidMsg(this, key, errors);
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

        // this.model.net_worth = e.value;
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

        // this.model.annual_income = e.value;
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
      app.validation.invalidMsg(this, 'zip_code', 'Sorry your zip code is not found');
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

      app.showLoading();

      setTimeout(() => app.hideLoading(), 1000);
      return 0;

      // if ($("#financial_info").hasClass("active")) {
      //   app.routers.navigate("/", {trigger: true});
      //   return;
      // }

    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      try {
        this.$('.slider-net-worth').bootstrapSlider('destroy');
        this.$('.slider-annual-income').bootstrapSlider('destroy');
      } catch(e) {
      }
    },

  },
    app.helpers.phone.methods,
    app.helpers.yesNo.methods,
    app.helpers.social.methods,
  )),

  changePassword: Backbone.View.extend({
    urlRoot: app.config.authServer + '/rest-auth/password/change',
    events: {
      'submit form': api.submitAction,
    },

    initialize() {
      this.listenToNavigate();
    },

    getSuccessUrl(data) {
      // app.user.passwordChanged(data.key);
      return '/account/profile';
    },

    render() {
      let template = require('./templates/changePassword.pug');
      this.$el.html(template({}));
      return this;
    },
  }),

  setNewPassword: Backbone.View.extend({
    urlRoot: app.config.authServer + '/reset-password/do',
    events: {
      'submit form': api.submitAction,
    },

    initialize() {
      this.listenToNavigate();
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
      'click .cancelInvestment': 'cancelInvestment',
      'click .agreementLink': 'openAgreement',
      'click .financial-docs-link': 'showFinancialDocs',
      'click .openPdfPreview': 'openPdfPreview',
    },

    initialize(options) {
      this.fields = options.fields;
      this.fields.cancelled_reason.label = 'What is the main reason for your cancellation?';
      this.fields.feedback.label = 'Do you have any suggestions to improve our platform?';
      this.model.data = (this.model.data || []).map(investment => new InvestmentModel(investment, this.fields));

      this.snippets = {
        investment: require('./templates/snippets/investment.pug'),
        creditSection: require('./templates/snippets/creditSection.pug'),
        confirmCancel: require('./templates/snippets/confirm-cancel.pug'),
        noInvestments: require('./templates/snippets/no-investments.pug'),
      };

      this.listenToNavigate();
    },

    render() {
      this.$el.html(this.template({
        investments: this.model.data,
        snippets: this.snippets,
        fields: this.fields,
      }));
    },

    openAgreement(e) {
      e.preventDefault();
      const objectId = e.target.dataset.objectId;

      const data = {
        title: 'Agreements',
        files: [
          {
            mime: 'application/pdf',
            name: 'Subscription Agreement.pdf',
            urls: { origin: "/" + e.target.dataset.objectId + "/" + e.target.dataset.type },
          }, {
            mime: 'application/pdf',
            name: 'Participation Agreement.pdf',
            urls: { origin: "/" + e.target.dataset.objectId + "/0" },
          },
        ],
      };

      app.helpers.fileList.show(data);
      document.querySelectorAll('.modal .openPdfPreview').forEach((el) => {
        el.onclick = this.openPdfPreview;
      });
      // $('.openPdfPreview').click(this.openPdfPreview);
    },

    openPdfPreview(e) {
      app.utils.openPdfPreview(e.currentTarget.dataset.link);
      return false;
    },

    _findInvestment(id) {
      return (this.model.data || []).find(inv => inv.id == id);
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

      app.helpers.fileList.show(data);
    },

    onCancel(investment) {
      app.analytics.emitEvent(app.analytics.events.InvestmentCancelled, app.user.stats);

      (this.model.data || []).forEach((i) => {
        if (i.campaign_id != investment.campaign_id)
          return;

        i.campaign.amount_raised -= investment.amount;
        this.$('[data-investmentid=' + i.id + ']').replaceWith(this.snippets.investment(i));
      });

      //update available credit section
      if (app.user.get('days_left') > 0 && investment.comission < FEES.fees_to_investor) {
        let credit = app.user.get('credit');
        let creditReturn = FEES.fees_to_investor - investment.comission;
        credit += creditReturn;
        app.user.set('credit', credit)
        let $creditSection = this.$('.credit-investor');
        if ($creditSection.length)
          $creditSection.html(this.snippets.creditSection());
        else
          this.$('.investor-dashboard').before(this.snippets.creditSection());
      }
    },

    confirmCancellation($container) {
      return new Promise((resolve) => {
        $container.append(this.snippets.confirmCancel({
          fields: this.fields,
        }));

        const $modal = $container.find('#investor_popup');

        let data = null;

        $modal.on('shown.bs.modal', () => {
          const $form = $modal.find('form');
          $form.off('submit');
          $form.on('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            data = $form.serializeJSON();

            $modal.modal('hide');

            return false;
          });
        });

        $modal.on('hidden.bs.modal', () => {
          $modal.find('form').off('submit');
          setTimeout(() => $modal.remove(), 100);
          resolve(data);
        });

        $modal.modal({
          backdrop: 'static',
        });

      });
    },

    //TODO: sort investments in dom on historical tab after cancel investment
    cancelInvestment(e) {
      e.preventDefault();

      let $target = $(e.target);
      let id = $target.closest('[data-investmentid]').data('investmentid');

      if (!id)
        return false;

      let investment = this._findInvestment(id);

      if (!investment)
        return console.error('Investment doesn\'t exist: ' + id);


      this.confirmCancellation($target.closest('div')).then((data) => {
        if (data === null)
          return;

        data.rating = data.rating || 0;
        api.makeRequest(app.config.investmentServer + '/' + id + '/decline', 'PUT', data).done((response) => {
          investment.deposit_cancelled_by_investor = true;

          $target.closest('.one_table').remove();

          let hasActiveInvestments = (this.model.data || []).some(i => i.active);
          if (!hasActiveInvestments)
            $('#active .investor_table')
              .append(this.snippets.noInvestments());

          let historicalInvestmentsBlock = this.$el.find('#historical .investor_table');
          let historicalInvestmentElements = historicalInvestmentsBlock.find('.one_table');
          let cancelledInvestmentElem = this.snippets.investment(investment);

          if (historicalInvestmentElements.length) {
            //find investment to insert before it
            let block = historicalInvestmentElements.filter((idx, elem) => {
              const investmentId = Number(elem.dataset.investmentid);
              return investment.id > investmentId;
            });
            if (block)
              block = block.first();

            if (block && block.length)
              $(block).before(cancelledInvestmentElem);
            else
              historicalInvestmentsBlock.append(cancelledInvestmentElem);
          } else {
            historicalInvestmentsBlock.empty();
            historicalInvestmentsBlock.append(cancelledInvestmentElem);
          }

          this.onCancel(investment);
        }).fail((err) => {
          app.dialogs.error(err.error);
        });
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
      'click .openPdfPreview': 'openPdfPreview',
    },

    initialize(options) {
      this.company = options.company;
      this.model = this.company;
      this.campaign = options.campaign;
      this.formc = options.formc;
      this.investors = options.investors;

      (this.investors.data || []).forEach((investor) => {
        investor.user.image_data = new Image(app.config.authServer + '/rest-auth/data', investor.user.image_data);
      });

      (this.investors.data || []).sort((i1, i2) => {
        return (new Date(i2.created_date)).valueOf() - (new Date(i1.created_date)).valueOf();
      });

      //this is auth cookie for downloadable files
      app.cookies.set('token', app.user.data.token, {
        domain: '.' + app.config.domainUrl,
        expires: 1000 * 60 * 60 * 24 * 30 * 12,
        path: '/',
      });

      this.listenToNavigate();
    },

    render() {
      this.$el.html(
        this.template({
          self: this,
          company: this.company,
          campaign: this.campaign,
          formc: this.formc,
          investors: this.investors
        })

      );

      const widget = require('./templates/snippets/widget.pug');
      this.el.querySelector('#widget').innerHTML = widget({
        company: this.company,
      });

      setTimeout(() => {
        $('.count-num').animateCount();
      },100);

      this.initComments();

      require.ensure(['src/js/graph/graph.js', 'src/js/graph_data.js'], () => {
        require('src/js/graph/graph.js');
        require('src/js/graph_data.js');
      }, 'graph_chunk');

      return this;
    },

    cancelCampaign(e) {
      e.preventDefault();
      app.dialogs.info('Please, call us 646-759-8228');
    },

    initComments() {
      const View = require('components/comment/views.js');
      const urlComments = app.config.commentsServer + '/company/' + this.company.id;
      let optionsR = api.makeRequest(urlComments, 'OPTIONS');
      let dataR = api.makeRequest(urlComments);

      $.when(optionsR, dataR).done((options, data) => {
        const [commentsData] = data;
        commentsData.id = this.company.id;
        commentsData.owner_id = this.company.owner_id;

        if (!commentsData.data || !commentsData.data.length) {
          this.$el.find('.no-comments').show();
          this.$el.find('.comments-container').closest('.row').hide();
        } else {
          this.$el.find('.no-comments').hide();
          this.$el.find('.comments-container').closest('.row').show();

          this.commentsView = new View.comments({
            model: commentsData,
            fields: options[0].fields,
            allowQuestion: false,
            readonly: this.campaign.expired,
            cssClass: 'col-xl-8 offset-xl-0',
          });

          this.commentsView.render();

          function countComments(comments) {
            let count = comments.length || 0;
            (comments || []).forEach((c) => {
              count += countComments(c.children);
            });
            return count;
          }

          const commentsCount = countComments(commentsData.data);

          $('.interactions-count').data('value', commentsCount).text(commentsCount);
          $('.interactions-count').animateCount();
        }
      });
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      if (this.commentsView)
        this.commentsView.destroy();
    },

    openPdfPreview(e) {
      let url = e.currentTarget.getAttribute('href');
      app.utils.openPdfPreview(url);
      return false;
    },
  }),
};
