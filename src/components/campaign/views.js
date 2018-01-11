const companyFees = require('consts/raisecapital/companyFees.json');
const STATUSES = require('consts/raisecapital/companyStatuses.json').STATUS;

const COUNTRIES = require('consts/countries.json');

const CalculatorView = require('./revenueShareCalculator.js');

const emitCustomEvent = (data) => {
  if (!data)
    return;

  let trackerId = data.ga_id;
  let pixelId = data.fb_pixel;

  if (!trackerId && !pixelId)
    return;

  const ids = {};

  if (trackerId && !trackerId.startsWith('UA-'))
    trackerId = 'UA-' + trackerId;

  if (trackerId)
    ids.trackerId = trackerId;

  if (pixelId)
    ids.pixelId = pixelId;

  app.analytics.emitCompanyCustomEvent(ids);
};

module.exports = {
  list: Backbone.View.extend({
    el: '#content',
    template: require('./templates/list.pug'),
    events: {
      'change select.orderby': 'orderby',
    },
    initialize(options) {
      this.collection = options.collection;
      this.listenToNavigate();
    },

    render() {
      //require('sass/pages/_campaing.sass');

      require('bootstrap-select/sass/bootstrap-select.scss');

      require('bootstrap-select');
      this.$el.html('');
      this.$el.append(
        this.template({
          collection: this.collection,
        })
      );
      this.$el.find('.selectpicker').selectpicker();
      //selectPicker('.selectpicker');
      return this;
    },

    orderby(e) {
      let $target = $(e.target);
      app.routers.navigate('/companies?page=1&orderby=' + $target.val(), { trigger: true });
    },
  }),

  detail: Backbone.View.extend({
    el: '#content',
    template: require('./templates/detail.pug'),
    events: {
      'click .tabs-scroll .nav .nav-link': 'smoothScroll',
      'hide.bs.collapse .panel': 'onCollapse',
      'show.bs.collapse .panel': 'onCollapse',
      'click .see-all-risks': 'seeAllRisks',
      'click .see-all-faq': 'seeAllFaq',
      'click': 'readMore',
      // 'click .see-all-article-press': 'seeAllArticlePress',
      'click .more-less': 'showMore',
      'hidden.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
      'shown.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
      'click .submit_form': 'submitCampaign',
      'click .company-documents': 'showDocumentsModal',
    },

    onCollapse (e) {
      let $elem = $(e.currentTarget);
      let $icon = $elem.find('.fa');
      let $a = $elem.find('a.list-group-item-action');
      if (e.type === 'show') {
        $a.addClass('active');
        $icon.removeClass('fa-angle-down').addClass('fa-angle-up');
      } else if (e.type === 'hide') {
        $a.removeClass('active');
        $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
      }
    },

    initialize(options) {
      $(document).off("scroll", this.onScrollListener);
      $(document).on("scroll", this.onScrollListener);
      this.companyDocsData = {
        title: 'Financials',
        files: this.model.formc
          ? (this.model.formc.fiscal_prior_group_data || []).concat(this.model.formc.fiscal_recent_group_data || [])
          : []
      };

      emitCustomEvent(this.model);

      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      $(document).off("scroll", this.onScrollListener);
      if (this.commentsView) {
        this.commentsView.destroy();
        this.commentsView = null;
      }
    },

    submitCampaign(e) {
      api.makeRequest(
        app.config.raiseCapitalServer + '/company/' + this.model.id,
        'GET'
      ).then(function(data) {
        if (
            data.progress.general_information == true &&
            data.progress.media == true &&
            data.progress.specifics == true &&
            data.progress['team-members'] == true
        ) {
          $('#company_publish_confirm').modal('show');
        } else {
          Object.keys(data.progress || {}).forEach((k) => {
            const d = data.progress[k];
            if(k != 'perks') {
              if(d == false)  {
                $('#company_publish .'+k).removeClass('collapse');
              } else {
                $('#company_publish .'+k).addClass('collapse');
              }
            }
          });
          $('#company_publish').modal('toggle');
        }
      });
    },

    showMore(e) {
      e.preventDefault();
      let $a = $(e.target);
      let k = $a.data('index');
      let $p = this.$('.member-bio[index=' + k + ']');
      $p.text($p.data('full-text'));
      $p.css({ height: 'auto' });
      $a.hide();
    },

    // seeAllArticlePress(e) {
    //   e.preventDefault();
    //   let $elems = this.$('.hidden-article-press');
    //   if ($elems.css('display') == 'none') {
    //     $elems.css('display', 'inline-block');
    //   } else {
    //     $elems.css('display', 'none');
    //   }
    // },

    onArticlePressCollapse(e) {
      if (e.type == 'hidden') {
        this.$('.see-all-article-press').text('Show More')
      } else if (e.type == 'shown') {
        this.$('.see-all-article-press').text('Show Less')
      }
    },

    seeAllRisks(e){
      e.preventDefault();
      this.$('.risks .collapse').collapse('show');
    },

    seeAllFaq(e){
      e.preventDefault();
      this.$('.faq .collapse').collapse('show');
    },

    smoothScroll(e) {
      e.preventDefault();
      $(document).off("scroll");
      $('.tabs-scroll .nav').find('.nav-link').removeClass('active');
      $(this).addClass('active');

      let $target = $(e.target.hash),
          $navBar = $('.navbar.navbar-default');

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top - $navBar.height() - 15
      }, 500, 'swing', () => {
        // window.location.hash = e.target.hash;
        $(document).on("scroll", this.onScrollListener);
      });
    },

    onScrollListener() {
      var scrollPos = $(window).scrollTop(),
      $navBar = $('.navbar.navbar-default'),
      $link = $('.tabs-scroll .nav').find('.nav-link');
      $link.each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href")).closest('section');
        if (!refElement || !refElement.length)
          return;

        if (refElement.position().top - $navBar.height() <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $link.removeClass("active");
          currLink.addClass("active");
        } else{
          currLink.removeClass("active");
        }
      });
    },

    showDocumentsModal(e) {
      e.preventDefault();
      app.helpers.fileList.show(this.companyDocsData);
    },

    initAsyncUI() {
      this.initStickyToggle();
      // if (this.model.campaign.security_type == 1)
      //  (new CalculatorView.calculator()).render();

      Promise.all([
        this.initFancyBox(),
        this.initComments()
      ]).then(() => {
        app.hideLoading();
      });
    },

    initFancyBox() {
      return new Promise((resolve, reject) => {
        const $fancyBox = this.$('.fancybox');

        $fancyBox.on('click', (e) => { e.preventDefault(); return false; });

        require.ensure([
          'components/fancybox/js/jquery.fancybox.js',
          'components/fancybox/css/jquery.fancybox.css',
        ], (require) => {
          const fancybox = require('components/fancybox/js/jquery.fancybox.js');
          const fancyboxCSS = require('components/fancybox/css/jquery.fancybox.css');

          $fancyBox.off('click');

          $fancyBox.fancybox({
            openEffect  : 'elastic',
            href: $(this).attr('href'),
            closeEffect : 'elastic',

            helpers: {
              title : {
                type : 'inside'
              },
            },
            beforeShow(){
              const $html = $('html');
              ['fancybox-margin', 'fancybox-lock'].forEach((cssClass) => {
                if (!$html.hasClass(cssClass)) {
                  $html.addClass(cssClass);
                }
              });
              app.preventBodyScrolling(true);
            },
            afterClose(){
              $('html').removeClass('fancybox-margin fancybox-lock');
              app.preventBodyScrolling(false);
            }
          });
          resolve();
        }, 'fancybox_chunk');
      });
    },

    initStickyToggle() {
      var stickyToggle = function(sticky, stickyWrapper, scrollElement) {
        var stickyHeight = sticky.outerHeight();
        var stickyTop = stickyWrapper.offset().top;
        if (scrollElement.scrollTop() >= stickyTop){
          stickyWrapper.height(stickyHeight);
          sticky.addClass("is-sticky");
        }
        else{
          sticky.removeClass("is-sticky");
          stickyWrapper.height('auto');
        }
      };

      this.$el.find('[data-toggle="sticky-onscroll"]').each(function() {
        var sticky = $(this);
        var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
        sticky.before(stickyWrapper);
        sticky.addClass('sticky');

        // Scroll & resize events
        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function() {
          stickyToggle(sticky, stickyWrapper, $(this));
        });

        // On page load
        stickyToggle(sticky, stickyWrapper, $(window));
      });
    },

    initComments() {
      return new Promise((resolve, reject) => {
        const View = require('components/comment/views.js');
        const urlComments = app.config.commentsServer + '/company/' + this.model.id;
        let optionsR = api.makeRequest(urlComments, 'OPTIONS');
        let dataR = api.makeRequest(urlComments);

        $.when(optionsR, dataR).done((options, data) => {
          data[0].id = this.model.id;
          data[0].owner_id = this.model.owner_id;

          this.commentsView = new View.comments({
            // model: commentsModel,
            model: data[0],
            fields: options[0].fields,
            cssClass: 'offset-xl-2',
            readonly: this.model.is_approved != STATUSES.VERIFIED,
          });
          this.commentsView.render();

          if (location.hash && location.hash.indexOf('comment') >= 0) {
            let $comments = $(location.hash);
            if ($comments.length)
              $comments.scrollTo(65);
          }
          resolve();
        }).fail(reject);
      });
    },

    render() {
      if (this.model.isClosed() || (this.model.is_approved >= 6 && this.model.campaign.expired)) {
        const template = require('./templates/detailNotAvailable.pug');
        this.$el.html(template());
        app.hideLoading();
        return this;
      }

      this.$el.html(
        this.template({
          values: this.model,
          edit: this.edit,
          previous: this.previous,
          preview: this.preview,
        })
      );

      $('.nav-tabs li').click(function (e) {
        $('.nav-tabs li').removeClass('active');
        $(this).addClass('active');
      });

      setTimeout(() => {
        this.initAsyncUI();
      }, 100);

      this.$el.find('.perks .col-xl-4 p').equalHeights();
      this.$el.find('.team .auto-height').equalHeights();
      this.$el.find('.card-inverse p').equalHeights();

      // fetch vimeo
      $('.vimeo-thumbnail').each(function(elem, idx) {
        let id = $(this).data('vimeo-id');
        let url = window.location.protocol + '//vimeo.com/api/v2/video/' + id + '.xml';
        $.ajax({
          method: 'GET',
          url: url,
          success: function(data) {
            let $xml = $(data);
            let thumbnailUrl = $xml.find('thumbnail_medium').text();
            let id = $xml.find('id').text();
            $('.vimeo-thumbnail[data-vimeo-id=' + id + ']').attr('src', thumbnailUrl);
          },
        });
      });

      this.$('#documents-modal').modal('hide');

      return this;
    },

    readMore(e) {
      const $target = $(e.target).closest('.show-more-members');
      if ($target.length) {
        e.preventDefault();
        $(e.target).parent().addClass('show-more-detail');
      } else {
        this.$('.show-more-members').parent().removeClass('show-more-detail');
      }
    },
  }),

  investment: Backbone.View.extend({
    el: '#content',
    template: require('./templates/investment.pug'),
    urlRoot: app.config.investmentServer + '/',
    doNotExtendModel: true,
    events: {
      'click #submitButton': 'submit',
      'keyup #amount': 'updateAmount',
      'change #amount': 'roundAmount',
      'focusout #amount': 'triggerAmountChange',
      'keyup .us-fields :input[name*=zip_code]': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .previewPdf': 'openPdfPreview',
      'change #personal_information_data__country': 'changeCountry',
      'change #payment_information_type': 'changePaymentType',
      'keyup .typed-name': 'copyToSignature',
      'keyup #annual_income,#net_worth': 'updateLimitInModal',
      // 'click .submit-income-worth': 'updateIncomeWorth',
      'click': 'hidePopover',
      'hidden.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
      'shown.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
    },

    initialize(options) {
      this.fields = options.fields;
      this.user = options.user;
      this.fields.amount.type = 'money';
      this.user.account_number_re = this.user.account_number;
      this.user.routing_number_re = this.user.routing_number;
      this.fields.payment_information_type.validate.choices = {
        0: 'Echeck (ACH)',
        1: 'Check',
        2: 'Wire',
      };

      // Validation rules
      //this.fields.personal_information_data.requiredTemp = true;
      //this.fields.payment_information_data.requiredTemp = true;
      this.fields.payment_information_data.schema.account_number = {
        type: 'password',
        required: true,
        minLength: 5,
        dependies: ['account_number_re'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'payment_information_data.account_number_re')) {
            throw "Account number fields don't match";
          }
        },
      };

      this.fields.payment_information_data.schema.account_number_re = {
        type: 'password',
        required: true,
        minLength: 5,
        dependies: ['account_number'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'payment_information_data.account_number')) {
            throw "Account number fields don't match";
          }
        },
      };

      this.fields.payment_information_data.schema.routing_number = {
        required: true,
        length: 9,
        dependies: ['routing_number_re'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'payment_information_data.routing_number_re')) {
            throw "Routing number fields don't match";
          }
        },
      };

      this.fields.payment_information_data.schema.routing_number_re = {
        required: true,
        length: 9,
        dependies: ['routing_number'],
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'payment_information_data.routing_number')) {
            throw "Routing number fields don't match";
          }
        },
      };

      /*
      this.fields.payment_information_data.schema.ssn = {
        type: 'password',
        required: false,
        _length: 9,
        dependies: ['ssn_re'],
        fn: function(name, value, attr, data, computed) {
          if (value != this.getData(data, 'payment_information_data.ssn_re')) {
            throw "Social security fields don't match";
          }
        },
      };

      this.fields.payment_information_data.schema.ssn_re = {
        type: 'password',
        required: true,
        _length: 9,
        dependies: ['ssn'],
        fn: function(name, value, attr, data, computed) {
          if (value != this.getData(data, 'payment_information_data.ssn')) {
            throw "Social security fields don't match";
          }
        },
      };
      */

      this.fields.signature = {
        required: true,
        minLength: 4
      };

      const validateAmount = (amount) => {
        amount = Number(amount);
        let min = this.model.campaign.minimum_increment;
        let max = this._maxAllowedAmount;
        let validationMessage = '';

        if (amount < min) {
          validationMessage = 'Sorry, minimum investment is $' + min;
        }

        if (amount > max) {
          validationMessage = 'Sorry, your amount is too high, please update your income or change amount';
        }

        if (validationMessage) {
          setTimeout(() => {
            this.$amount.popover('show');
            this.$amount.scrollTo(200);
          }, 700);
          throw validationMessage;
        }

        return true;
      };

      this.fields.amount.fn = function(name, value, attr, data, computed) {
        return validateAmount(value);
      };
      this.fields.amount.positiveOnly = true;

      this.model.campaign.expiration_date = new Date(this.model.campaign.expiration_date);

      this.fields.personal_information_data.schema.country = Object.assign(this.fields.personal_information_data.schema.country, {
        type: 'select',
        validate: {
          OneOf: {
            choices: Object.keys(COUNTRIES),
          },
          choices: COUNTRIES
        },
        messageRequired: 'Not a valid choice',
      });

      this.fields.personal_information_data.schema.phone = Object.assign(this.fields.personal_information_data.schema.phone, {
        required: false,
        fn: function(name, value, attr, data, schema) {
          let country = this.getData(data, 'personal_information_data.country');
          if (country == 'US')
            return;

          return this.required(name, true, attr, data);
        },
      });

      this.fields.personal_information_data.schema.city = Object.assign(this.fields.personal_information_data.schema.city, {
        required: false,
        fn: function(name, value, attr, data, schema) {
          let country = this.getData(data, 'personal_information_data.country');
          if (country == 'US')
            return;
          return this.required(name, true, attr, data);
        },
      });

      this.fields.personal_information_data.schema.state = Object.assign(this.fields.personal_information_data.schema.state, {
        // required: false,
        required: true,
        // fn: function(name, value, attr, data, schema) {
        //   let country = this.getData(data, 'personal_information_data.country');
        //   if (country == 'US')
        //     return;
        //   return this.required(name, true, attr, data);
        // },
      });

      // this.user.ssn_re = this.user.ssn;

      this.labels = {
        personal_information_data: {
          first_name: 'First Name',
          last_name: 'Last Name',
          country: 'Country',
          street_address_1: 'Street Address 1',
          street_address_2: 'Street Address 2',
          zip_code: 'Postal Code',
          phone: 'Phone',
          city: 'City',
        },
        payment_information_data: {
          name_on_bank_account: 'Name As It Appears on Bank Account',
          account_number: 'Account Number',
          account_number_re: 'Re-enter Account Number',
          routing_number: 'Routing Number',
          routing_number_re: 'Re-enter Routing Number',
          ssn: 'Social Security Number (SSN) or Tax ID (ITIN/EIN)',
          ssn_re: 'Re-enter',
        },
        payment_information_type: 'I Want to Pay Using',
        amount: 'Amount',
        fee: 'Commission',
        signature: 'Signature',
        is_reviewed_educational_material: `I confirm and represent that (a) I have reviewed
          the educational material that has been made available on this website, (b) I understand
          that the entire amount of my investment may be lost, (c) I am in a
          financial condition to bear the loss of the investment and (d) I represent that
          I have not exceeded my investment limitations.`,
        is_understand_restrictions_to_cancel_investment: `I understand that there are restrictions
          on my ability to cancel an investment commitment and obtain a return of my investment.`,
        is_understand_difficult_to_resell_purchashed: `I understand that it may be difficult to
          resell securities purchased on GrowthFountain.`,
        is_understand_investing_is_risky: `I understand that investing in start-ups and small
          businesses listed on GrowthFountain is very risky, and that I should not invest any
          funds unless I can afford to lose my entire investment.`,
        is_understand_securities_related: `I understand that GrowthFountain performs all securities
          related activities. I further understand that DCU (Digital Federal Credit Union) (a) does
          not participate in the selection or review of any issuers, (b) does not have any responsibility
          for the accuracy or completeness of any information provided by any issuer and (c) does not provide
          any investment advice or recommendations.`,
      };

      this.snippets = {
        us: require('./templates/snippets/usFields.pug'),
        nonUs: require('./templates/snippets/nonUsFields.pug'),
      };

      this.assignLabels();

      if(window.location.hostname == 'dcu.growthfountain.com' || window.location.hostname == 'tvfcu.growthfountain.com' || window.location.hostname == 'alpha-dcu.growthfountain.com' || window.location.hostname == 'alpha-tvfcu.growthfountain.com') {
      //if(window.location.hostname == 'localhost') {
        this.fields.is_understand_securities_related = Object.assign({}, this.fields.is_reviewed_educational_material);
        this.fields.is_understand_securities_related.label = this.labels.is_understand_securities_related;
        if(window.location.hostname == 'tvfcu.growthfountain.com' || window.location.hostname == 'alpha-tvfcu.growthfountain.com') {
          this.fields.is_understand_securities_related.label = this.fields.is_understand_securities_related.label.replace(/DCU \(Digital Federal Credit Union\)/ig, 'TVFCU (Tennessee Valley Federal Credit Union) ')
        }
      } else {
        delete this.fields.is_understand_securities_related;
      }

      this.initMaxAllowedAmount();

      emitCustomEvent(this.model);

      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);

      if (this.$amount)
        this.$amount.popover('dispose');

      const $modal = this.$('#income_worth_modal');

      $modal.modal('hide');

      ['show.bs.modal', 'shown.bs.modal', 'hide.bs.modal', 'hidden.bs.modal',].forEach((event) => {
        $modal.off(event);
      });
    },

    render() {
      if (this.model.isClosed() || (this.model.is_approved >= 6 && this.model.campaign.expired)) {
        const template = require('./templates/detailNotAvailable.pug');
        this.$el.html(template());
        return this;
      }

      this.$el.html(
        this.template({
          snippets: this.snippets,
          fields: this.fields,
          values: this.model,
          user: this.user,
          states: app.helpers.usaStates,
          feeInfo: this.calcFeeWithCredit(),
        })
      );

      this.initAmountPopover();

      setTimeout(this.attachUpdateNetWorthModalEvents.bind(this), 100);

      $('span.current-limit').text(this._maxAllowedAmount.toLocaleString('en-US'));
      setTimeout(() => {
        api.makeRequest(
            app.config.emailServer + '/subscribe',
            'PUT',
            {'company_id': this.model.id, 'type': 'invest'}
            );
      }, 2500);

      return this;
    },

    attachUpdateNetWorthModalEvents() {
      let $networthModal = this.$('#income_worth_modal');
      let $submitButton = $networthModal.find('.submit-income-worth');

      $networthModal.off('shown.bs.modal');
      $networthModal.off('hidden.bs.modal');

      $networthModal.on('shown.bs.modal', () => {
        $submitButton.off('click');
        $submitButton.on('click', this.updateIncomeWorth.bind(this));
      });

      $('#income_worth_modal').on('hidden.bs.modal', () => {
        $submitButton.off('click');
        this.$amount.keyup();
      });
    },

    onArticlePressCollapse(e) {
      if (e.type == 'hidden') {
        this.$('.see-all-perks').text('Show More')
      } else if (e.type == 'shown') {
        this.$('.see-all-perks').text('Show Less')
      }
    },

    calcFeeWithCredit() {
      const credit = this.user.credit;
      const fee = companyFees.fees_to_investor;

      if (credit <= 0)
        return {
          waived: 0,
          fee: fee,
          remainCredit: 0,
          credit: 0,
        };

      return {
        waived: fee,
        fee: credit > fee
          ? 0
          : fee - credit,
        remainingCredit: credit >= fee
          ? credit - fee
          : 0,
        credit: credit,
      };
    },

    initAmountPopover() {
      this.$amount = this.$el.find('#amount');
      this.$amount.data('contentselector', 'amount-campaign');
      this.$amount.data('max', this._maxAllowedAmount);

      this.$amount.popover({
        placement(context, src) {
          return 'top';
        },
        container: '#content',
        html: true,
        content(){
          let $this = $(this);
          let currentTip = $this.data('contentselector');
          let max = $this.data('max').toLocaleString('en-US');

          var content = $('.invest_form .popover-content-' + currentTip).html();

          if (currentTip == 'amount-ok' || currentTip == 'amount-campaign') {
            content = content.replace(/\:amount/g, max);
          }

          return content;
        },
        trigger: 'manual',
        delay: 50,
      }).popover('hide');
    },

    updateAmountPopover(contentSelector, force) {
      let currentSelector = this.$amount.data('contentselector');

      if (force || currentSelector !== 'rounding') {
        this.$amount.data('contentselector', contentSelector);
      }

      this.$amount.popover('show');
    },

    triggerAmountChange(e) {
      setTimeout(() => {
        this.$amount.trigger('change');
      }, 600);
    },

    validateAmount(amount) {
      amount = Number(amount);
      let min = this.model.campaign.minimum_increment;
      let max = this._maxAllowedAmount;
      if (amount < min) {
        this.updateAmountPopover('minimum-increment', true);
        return false;
      }

      if (amount > max) {
        this.updateAmountPopover('amount-campaign', true);
        $('.popover a.update-income-worth')
          .off('click')
          .on('click', (e) => {
            this.$amount.popover('hide');
          });

        return false;
      }

      this.updateAmountPopover('amount-ok');

      return true;
    },

    maxInvestmentsPerYear(annualIncome, netWorth, investedPastYear, investedOtherSites) {
      const coef = (annualIncome >= 100 && netWorth >= 100) ? 0.1 : 0.05;
      let maxInvestmentsPerYear = Math.min(annualIncome, netWorth) * coef;

      if (maxInvestmentsPerYear < 2)
        maxInvestmentsPerYear = 2.2;

      if (maxInvestmentsPerYear > 107)
        maxInvestmentsPerYear = 107;

      return Math.round((maxInvestmentsPerYear * 1000 - investedPastYear - investedOtherSites));
    },

    initMaxAllowedAmount() {
      let annualIncome = this.user.annual_income;
      let netWorth = this.user.net_worth;
      let investedOnOtherSites = this.user.invested_on_other_sites;
      let investedPastYear = this.user.invested_equity_past_year;

      this._maxAllowedAmount = this.maxInvestmentsPerYear(annualIncome, netWorth,
        investedPastYear, investedOnOtherSites);
    },

    getNumber(value) {
      return Number(value.replace(/[\$,]/g, ''));
    },

    formatNumber(value) {
      return value.toLocaleString('en-US');
    },

    roundAmount(e) {
      // e.preventDefault();

      let amount = this.getNumber(e.target.value);

      if (!amount)
        return;

      if (!this.validateAmount(amount))
        return;

      //revenue share or amount is less that common equity amount
      if (this.model.campaign.security_type == 1 ||
        this.model.campaign.security_type == 2 && amount < this.model.campaign.hybrid_toggle_amount) {
        return;
      }

      let pricePerShare = this.model.campaign.price_per_share;
      if (!pricePerShare) {
        return;
      }

      let newAmount = Math.ceil(amount / pricePerShare) *  pricePerShare;

      this.$amount.val('$' + this.formatNumber(newAmount));
      this._updateTotalAmount();

      if (newAmount > amount) {
        this.updateAmountPopover('rounding', true);
      }

      // return false;
    },

    updateAmount(e) {
      e.preventDefault();
      e.stopPropagation();

      app.helpers.format.formatMoneyInputOnKeyup(e);

      let amount = this.getNumber(e.target.value);
      if (!amount)
        return;

      this.$amount.data('rounded', false);

      this.validateAmount(amount);

      this.updatePerks(amount);

      this._updateTotalAmount();

      return false;
    },

    updatePerks(amount) {
      function updatePerkElements(allList, amount) {
        allList.forEach((el) => {el.classList.remove('active')});
        var activePerk = Array.prototype.filter.call(allList, function(el) {
          return el.dataset.amount <= amount;
        })
        if (activePerk.length != 0) {
          var result = activePerk.pop();
          result.classList.add('active');
        }
      }
      updatePerkElements(this.el.querySelectorAll('.invest-perks-mobile .perk'), amount);
      updatePerkElements(this.el.querySelectorAll('.invest-perks .perk'), amount);  
    },

    _updateTotalAmount() {
      const feeInfo = this.calcFeeWithCredit();

      let totalAmount = this.getNumber(this.$amount.val()) + feeInfo.fee;
      let formattedTotalAmount = '$' + this.formatNumber(totalAmount)
      this.$el.find('.total-investment-amount').text(formattedTotalAmount);
      this.$el.find('[name=total_amount]').val(formattedTotalAmount);

    },

    hidePopover(e) {
      if (e.target == this.$amount[0])
        return;

      this.$amount.popover('hide');
    },

    updateLimitInModal(e) {
      e.preventDefault();
      e.stopPropagation();

      app.helpers.format.formatMoneyInputOnKeyup(e);
      const rx = /[\$,]/g;

      let annualIncome = Number(this.$('#annual_income').val().replace(rx, ''));
      let netWorth = Number(this.$('#net_worth').val().replace(rx, '')) || 0;
      if (isNaN(annualIncome) || !annualIncome)
        annualIncome = 0;
      if (isNaN(netWorth) || !netWorth)
        netWorth = 0;

      let investedOnOtherSites = this.user.invested_on_other_sites;
      let investedPastYear = this.user.invested_equity_past_year;

      this.$('span.current-limit').text(
        this.maxInvestmentsPerYear(annualIncome / 1000, netWorth / 1000, investedPastYear, investedOnOtherSites)
          .toLocaleString('en-US')
      );

      return false;
    },

    updateIncomeWorth(e) {
      const rx = /[\$,]/g;
      let netWorth = $('#net_worth')
        .val()
        .trim()
        .replace(rx, '') / 1000;

      let annualIncome = $('#annual_income')
        .val()
        .trim()
        .replace(rx, '') / 1000;

      let data = {
        net_worth: netWorth,
        annual_income: annualIncome
      };

      const validateRange = (value, min=0, max, prefix) => {
        if (value < min)
          throw `${prefix || ''} must not be less than ${app.helpers.format.formatNumber(min)}.`;

        if (value > max)
          throw `${prefix || ''} must not be greater than ${app.helpers.format.formatNumber(max)}.`;
      };

      let fields = {
        net_worth: {
          required: true,
          // fn: function(name, value, attr, data, schema) {
          //   return validateRange(value * 1000, 0, 5000000 * 2, 'Net Worth')
          // },
        },
        annual_income: {
          required: true,
          // fn: function(name, value, attr, data, schema) {
          //   return validateRange(value * 1000, 0, 500000 * 2, 'Annual Income');
          // },
        }
      };

      $('#income_worth_modal .helper-block').remove();

      if(!app.validation.validate(fields, data, this)) {
        e.preventDefault();
        Object.keys(app.validation.errors).forEach((key) => {
          const errors = app.validation.errors[key];
          app.validation.invalidMsg(this, key, errors);
        });
        return false;
      }

      api.makeRequest(app.config.authServer + '/rest-auth/data', 'PATCH', data).done((data) => {
        this.user.net_worth = netWorth;
        this.user.annual_income = annualIncome;

        this.initMaxAllowedAmount();
        $('span.current-limit').text(this._maxAllowedAmount.toLocaleString('en-US'));
        this.$amount.data('max', this._maxAllowedAmount);

        $('#income_worth_modal').modal('hide');

        this.$amount.keyup();

      }).fail((xhr, status, text) => {
        app.dialogs.error('Update failed. Please try again!');
      });
    },

    changePaymentType(e) {
      let val = $(e.target).val();
      this.$('.payment-fields').hide();
      if (val == 0) {
        $('.echeck-fields').show();
      } else if (val == 1) {
        $('.check-fields').show();
      } else if (val == 2) {
        $('.wire-fields').show();
      }
    },

    copyToSignature(e) {
      this.$('.signature').text(this.el.querySelector("#signature").value);
    },

    changeCountry(e) {
      const isUS = e.target.value === 'US';

      let $row = isUS ? $('.other-countries-fields') : $('.us-fields');

      if (!$row.length)
        return;


      if (isUS) {
        this.fields.personal_information_data.schema.zip_code.label = 'Postal Code';
      } else {
        this.fields.personal_information_data.schema.zip_code.label = 'Zip Code';
      }

      let args = {
        fields: this.fields,
        user: this.user,
      };

      $row.after(isUS ? this.snippets.us(args) : this.snippets.nonUs(args));

      $row.remove();
    },

    submit(e) {
      e.preventDefault();

      let data = $('#investForm').serializeJSON();
      // data.amount = data.amount.replace(/\,/g, '');
      if(data['payment_information_type'] == 1 || data['payment_information_type'] == 2) {
        delete data['payment_information_data'];
        // Temp solution !
        delete this.fields.payment_information_data;
      }
      api.submitAction.call(this, e, data);
    },

    getSuccessUrl(data) {
      return (data.company.slug || data.company.id) + '/' + data.id + '/invest-thanks';
    },

    saveEsign(responseData) {
      api.makeRequest(
        app.config.esignServer,
        "POST",
        {
          investment_id: responseData.id,
          signature: this.el.querySelector("#signature").value
        }
      ).done( (response) => {
        $('body').scrollTo();
        this.undelegateEvents();
        app.routers.navigate(this.getSuccessUrl(responseData), {
            trigger: true,
            replace: false
        });
      })
      .fail( (err) => {
        console.log(err);
        alert('Esignatures havent been created');
        $('body').scrollTo();
        this.undelegateEvents();
        app.routers.navigate(this.getSuccessUrl(responseData), {
            trigger: true,
            replace: false
        });
      });
    },

    updateLocation(e) {
      let city = this.$('.js-city').val();
      let state = this.$('.js-state').val();
      this.$('.js-city-state').text(city + ', ' + state);
      this.$('.us-fields input[name*=city]').val(city);
      this.$('.us-fields input[name*=state]').val(state);
    },

    changeZipCode(e) {
      // if not 5 digit, return
      if (e.target.value.length < 5) return;
      if (!e.target.value.match(/\d{5}/)) return;
      app.helpers.location(e.target.value, ({ success=false, city="", state=""}) => {
        // this.zipCodeField.closest('div').find('.help-block').remove();
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          this.$('.js-city').val(city);
          this.$('.js-state').val(state);
          this.$('.us-fields input[name*=city]').val(city);
          this.$('.us-fields input[name*=state]').val(state);
        } else {
          console.log("error");
        }
      });
    },

    openPdfPreview(e) {

      let cityInput = this.el.querySelector('#personal_information_data__city input');
      if (cityInput === null) {
        cityInput = this.el.querySelector('#personal_information_data__city');
      }

      const url = '/preview/' + this.model.slug + '/' + e.currentTarget.dataset.pdfType
        + '?amount=' + (this.el.querySelector('#amount').value.replace(/[\$,]/g, '') || 0)
        + '&commission=' + this.calcFeeWithCredit().fee
        + '&company_id=' + this.model.id
        + '&email=' + app.user.data.email
        + '&first_name=' + this.el.querySelector('#personal_information_data__first_name').value
        + '&last_name=' +  this.el.querySelector('#personal_information_data__last_name').value
        + '&country=' +  this.el.querySelector('#personal_information_data__country').value
        + '&address=' +  this.el.querySelector('#personal_information_data__street_address_1').value
        + '&address2=' +  this.el.querySelector('#personal_information_data__street_address_2').value
        + '&zip_code=' +  this.el.querySelector('#personal_information_data__zip_code').value
        + '&city=' +  cityInput.value
        + '&state=' +  this.el.querySelector('#personal_information_data__state').value
        + '&signature=' +  this.el.querySelector('#signature').value;

      setTimeout(() => app.utils.openPdfPreview(url), 250);
      return false;
    },

    _success(data) {
      const feeInfo = this.calcFeeWithCredit();
      this.user.credit = feeInfo.remainingCredit;
      app.analytics.emitEvent(app.analytics.events.InvestmentMade, app.user.stats);
      this.saveEsign(data);
    },

  }),

  investmentThankYou: Backbone.View.extend({
    template: require('./templates/thankYou.pug'),
    el: '#content',
    initialize() {
      emitCustomEvent(this.model.company);
      $('.popover').popover('hide');
    },

    render() {
      this.$el.html(
        this.template({
          investment: this.model,
        })
      );

      api.makeRequest(
        app.config.emailServer + '/unsubscribe/invest',
        'PUT',
        {}
      );
      return this;
    },
  }),
};

