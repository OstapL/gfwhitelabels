const formatHelper = require('helpers/formatHelper');
const textHelper = require('helpers/textHelper');
const companyFees = require('consts/companyFees.json');
const typeOfDocuments = require('consts/typeOfDocuments.json');

const usaStates = require('helpers/usaStates.js');

const helpers = {
  text: textHelper,
  icons: require('helpers/iconsHelper.js'),
  format: formatHelper,
  fileList: require('helpers/fileList.js'),
};

const constants = {
  AccountType: require('consts/bankAccount.json'),
};

let countries = {};
_.each(require('helpers/countries.json'), (c) => { countries[c.code] = c.name; });

module.exports = {
  list: Backbone.View.extend({
    el: '#content',
    template: require('./templates/list.pug'),
    events: {
      'change select.orderby': 'orderby',
    },
    initialize(options) {
      this.collection = options.collection;
    },

    render() {
      //require('sass/pages/_campaing.sass');

      require('bootstrap-select/sass/bootstrap-select.scss');

      let selectPicker = require('bootstrap-select');
      this.$el.html('');
      this.$el.append(
        this.template({
          serverUrl: serverUrl,
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
      'click .email-share': 'shareWithEmail',
      'click .linkedin-share': 'shareOnLinkedin',
      'click .facebook-share': 'shareOnFacebook',
      'click .twitter-share': 'shareOnTwitter',
      'click .see-all-risks': 'seeAllRisks',
      'click .see-all-faq': 'seeAllFaq',
      'click .show-more-members': 'readMore',
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

      let params = app.getParams();
      this.edit = false;
      if (params.preview == '1' && this.model.owner == app.user.get('id')) {
        // see if owner match current user
        this.edit = true;
        this.previous = params.previous;
      }
      this.preview = params.preview ? true : false;

      this.companyDocsData = {
        title: 'Financials',
        files: this.model.formc
          ? _.union(this.model.formc.fiscal_prior_group_data, this.model.formc.fiscal_recent_group_data)
          : []
      };

    },

    submitCampaign(e) {

      api.makeRequest(
        raiseCapitalServer + '/company/' + this.model.id + '/edit',
        'GET'
      ).then(function(data) {
        if(
            data.progress.general_information == true &&
            data.progress.media == true &&
            data.progress.specifics == true &&
            data.progress['team-members'] == true
        ) {
          $('#company_publish_confirm').modal('show');
        } else {
          var errors = {};
          _(data.progress).each((d, k) => {
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
        }
        else{
          currLink.removeClass("active");
        }
      });
    },

    shareWithEmail (e) {
      event.preventDefault();
      let text = "Check out " + (this.model.short_name || this.model.name) + "'s fundraise on GrowthFountain";
      window.open("mailto:?subject=" + text + "&body=" + text + "%0D%0A" + window.location.href);
    },

    shareOnFacebook(event) {
      event.preventDefault();
      FB.ui({
        method: 'share',
        href: window.location.href,
        caption: this.model.tagline,
        description: this.model.description,
        title: 'Check out ' + (this.model.short_name || this.model.name) + "'s fundraise on GrowthFountain.com",
        picture: (this.model.campaign.header_image_data.url ? this.model.campaign.header_image_data.url : null),
      }, function(response){});
    },

    shareOnLinkedin(event) {
      event.preventDefault();
      window.open(encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href +
        '&title=' + 'Check out ' + (this.model.short_name || this.model.name) + "'s fundraise on GrowthFountain.com" +
            '&summary=' + this.model.description +
            '&source=Growth Fountain'),'Growth Fountain Campaign','width=605,height=545');
    },

    shareOnTwitter(event) {
      event.preventDefault();
      window.open(encodeURI('https://twitter.com/share?url=' + window.location.href +
            '&text=Check out ' + (this.model.short_name || this.model.name) + "'s fundraise on @growthfountain "),'Growth Fountain Campaingn','width=550,height=420');
    },

    showDocumentsModal(e) {
      e.preventDefault();
      helpers.fileList.show(this.companyDocsData);
    },

    render() {
      const socialMediaScripts = require('helpers/shareButtonHelper.js');
      const fancybox = require('components/fancybox/js/jquery.fancybox.js');
      const fancyboxCSS = require('components/fancybox/css/jquery.fancybox.css');

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          Urls: Urls,
          values: this.model,
          formatHelper: formatHelper,
          edit: this.edit,
          previous: this.previous,
          preview: this.preview,
          textHelper: textHelper,
          helpers: helpers,
        })
      );

      $('.nav-tabs li').click(function (e) {
        $('.nav-tabs li').removeClass('active');
        $(this).addClass('active');
      });

      // Will run social media scripts after content render
      socialMediaScripts.facebook();

      setTimeout(() => {
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

        /*$('*[data-toggle="lightbox"]').click(function (e) {
          e.preventDefault();
          $(this).ekkoLightbox();
        });*/
        /*this.$el.delegate('*[data-toggle="lightbox"]', 'click', function(event) {
          event.preventDefault();
          // $(this).ekkoLightbox();
          $(this).fancybox();
        }); */
        /*this.$('*[data-toggle="lightbox"]').fancybox({
          openEffect  : 'elastic',
          closeEffect : 'elastic',

          helpers : {
            title : {
              type : 'inside'
            }
          }
        });*/

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

        this.initComments();

      }, 100);

      this.$el.find('.perks .col-xl-4 p').equalHeights();
      this.$el.find('.team .auto-height').equalHeights();
      this.$el.find('.card-inverse p').equalHeights();
      this.$el.find('.modal').on('hidden.bs.modal', function(event) {
        $(event.currentTarget).find('iframe').attr('src', $(event.currentTarget).find('iframe').attr('src'));
      });

      //this.$('body').on('.click', '.show-more-members', function() {
      //  $('.hide-more-detail').addClass('.show-more-detail');
      // });
      // $('*[data-toggle="lightbox"]').fancybox({
      $('.fancybox').fancybox({
        openEffect  : 'none',
        closeEffect : 'none'
      });

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

    initComments() {
      const View = require('components/comment/views.js');
      const urlComments = commentsServer + '/company/' + this.model.id;
      let optionsR = api.makeRequest(urlComments, 'OPTIONS');
      let dataR = api.makeRequest(urlComments);

      $.when(optionsR, dataR).done((options, data) => {
        data[0].id = this.model.id;
        data[0].owner_id = this.model.owner_id;

        let comments = new View.comments({
          // model: commentsModel,
          model: data[0],
          fields: options[0].fields,
          cssClass: 'col-lg-8 offset-lg-2 col-md-12 offset-md-0 col-sm-12 offset-sm-0 col-xs-12 offset-xs-0 pt50',
        });
        comments.render();
      });
    },

    readMore(e) {
      e.preventDefault();
      $(e.target).parent().addClass('show-more-detail');
    },

  }),

  investment: Backbone.View.extend({
    el: '#content',
    template: require('./templates/investment.pug'),
    urlRoot: investmentServer + '/',
    doNotExtendModel: true,
    events: {
      'submit form.invest_form': 'submit',
      'keyup #amount': 'updateAmount',
      'change #amount': 'roundAmount',
      'focusout #amount': 'triggerAmountChange',
      'keyup .us-fields :input[name*=zip_code]': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .link-2': 'openPdf',
      'change #country': 'changeCountry',
      'change #payment_information_type': 'changePaymentType',
      'keyup .typed-name': 'copyToSignature',
      'keyup #annual_income,#net_worth': 'updateLimitInModal',
      'click button.submit-income-worth': 'updateIncomeWorth',
      'click': 'hidePopover',
    },

    initialize(options) {
      this.fields = options.fields;
      this.user = options.user;
      this.user.account_number_re = this.user.account_number;
      this.fields.payment_information_type.validate.choices = {
        0: 'Echeck (ACH)',
        1: 'Check',
        2: 'Wire',
      };

      // Validation rules
      this.fields.personal_information_data.requiredTemp = true;
      this.fields.payment_information_data.requiredTemp = true;
      this.fields.payment_information_data.schema.account_number = {
        type: 'password',
        required: true,
        minLength: 5,
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
        fn: function(name, value, attr, data, schema) {
          if (value != this.getData(data, 'payment_information_data.account_number')) {
            throw "Account number fields don't match";
          }
        },
      };

      this.fields.payment_information_data.schema.routing_number = {
        required: true,
        _length: 9,
      }

      this.fields.payment_information_data.schema.ssn = {
        type: 'password',
        required: true,
        _length: 9,
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
        fn: function(name, value, attr, data, computed) {
          if (value != this.getData(data, 'payment_information_data.ssn')) {
            throw "Social security fields don't match";
          }
        },
      };

      this.fields.signature = {
        type: 'nested',
        requiredTemp: true,
      };
      this.fields.signature.schema = {};
      this.fields.signature.schema.full_name = {
        required: true,
      };

      const validateAmount = (amount) => {
        amount = Number(amount);
        let min = this.model.campaign.minimum_increment;
        let max = this._maxAllowedAmount;

        if (amount < min) {
          throw 'Sorry, minimum investment is $' + min;
        }

        if (amount > max) {
          throw 'Sorry, your amount if too high, please update your income or change amount’';
        }

        return true;
      };

      this.fields.amount.fn = function(name, value, attr, data, computed) {
        return validateAmount(value);
      };

      this.model.campaign.expiration_date = new Date(this.model.campaign.expiration_date);

      this.fields.country = {
        validate: {
          OneOf: {
            choices: _.keys(countries),
          },
          choices: countries,
        }
      };

      this.user.ssn_re = this.user.ssn;

      this.labels = {
        country: 'Country',
        personal_information_data: {
          street_address_1: 'Street Address 1',
          street_address_2: 'Street Address 2',
          zip_code: 'Zip Code',
          city: 'City',
        },
        payment_information_data: {
          name_on_bank_account: 'Name On Bank Account',
          account_number: 'Account Number',
          account_number_re: 'Account Number Again',
          routing_number: 'Routing Number',
          ssn: 'Social Security number (SSN) or Tax ID (ITIN/EIN)',
          ssn_re: 'Re-enter',
        },
        payment_information_type: 'I Want to Pay Using',
        amount: 'Amount',
        fee: 'Commission',
        is_reviewed_educational_material: `I confirm and represent that (a) I have reviewed
          the educational material that has been made available on this website, (b) I understand
          that the entire amount of my investment may be lost and (c) I am in a
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

      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = usaStates;

      this.initMaxAllowedAmount();
      this.amountTimeout = null;
    },

    render() {

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          snippets: this.snippets,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          user: this.user,
          states: this.usaStates,
          countries: countries,
          constants: constants,
        })
      );

      this.initAmountPopover();

      $('#income_worth_modal').on('hidden.bs.modal', () => {
        this.$amount.keyup();
      });

      $('span.current-limit').text(this._maxAllowedAmount.toLocaleString('en-US'));

      return this;
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
      let maxInvestmentsPerYear = (annualIncome >= 100 && netWorth >= 100)
        ? Math.min(annualIncome, netWorth) * 0.1
        : Math.min(annualIncome, netWorth) * 0.05;

      maxInvestmentsPerYear = maxInvestmentsPerYear < 2 ? 2 : maxInvestmentsPerYear;

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

    getInt(value) {
      return parseInt(value.replace(/\,/g, ''));
    },

    formatInt(value) {
      return value.toLocaleString('en-US');
    },

    roundAmount(e) {
      // e.preventDefault();

      //revenue share
      if (this.model.campaign.security_type == 1)
        return;

      let amount = this.getInt(e.target.value);
      if (!amount)
        return;

      if (!this.validateAmount(amount))
        return;

      let pricePerShare = this.model.campaign.price_per_share;
      if (!pricePerShare)
        return;

      let newAmount = Math.ceil(amount / pricePerShare) *  pricePerShare;

      this.$amount.val(this.formatInt(newAmount));
      this._updateTotalAmount();

      if (newAmount > amount) {
        this.updateAmountPopover('rounding', true);
      }

      // return false;
    },

    updateAmount(e) {

      let amount = this.getInt(e.currentTarget.value);
      if (!amount)
        return;

      e.currentTarget.value = this.formatInt(amount);

      this.$amount.data('rounded', false);

      this.validateAmount(amount);

      this.updatePerks(amount);

      this._updateTotalAmount();
    },

    updatePerks(amount) {
      //update perks
      let $targetPerk;
      let $perks = this.$('.perk');
      $perks.each((i, el) => {
        if(parseInt(el.dataset.amount) <= amount) {
          $targetPerk = $(el);
          return false;
        }
      });

      $perks.removeClass('active').find('i.fa.fa-check').hide();
      if ($targetPerk)
        $targetPerk.addClass('active').find('i.fa.fa-check').show();
    },

    _updateTotalAmount() {
      // Here 10 is the flat rate;
      let totalAmount = this.getInt(this.$amount.val()) + 10;
      let formattedTotalAmount = '$' + this.formatInt(totalAmount)
      this.$el.find('.total-investment-amount').text(formattedTotalAmount);
      this.$el.find('[name=total_amount]').val(formattedTotalAmount);

    },

    hidePopover(e) {
      if (e.target == this.$amount[0])
        return;

      this.$amount.popover('hide');
    },

    getSuccessUrl(data) {
      return investmentServer + '/' + data.id + '/invest-thanks';
    },

    updateLimitInModal(e) {
      let annualIncome = Number(this.$('#annual_income').val().replace(/\,/g, '')) || 0,
          netWorth = Number(this.$('#net_worth').val().replace(/\,/g, '')) || 0;


      let investedOnOtherSites = this.user.invested_on_other_sites;
      let investedPastYear = this.user.invested_equity_past_year;

      this.$('#annual_income').val(annualIncome.toLocaleString('en-US'));
      this.$('#net_worth').val(netWorth.toLocaleString('en-US'));

      this.$('span.current-limit').text(
        this.maxInvestmentsPerYear(annualIncome / 1000, netWorth / 1000, investedPastYear, investedOnOtherSites)
          .toLocaleString('en-US')
      );
    },

    updateIncomeWorth(e) {
      let netWorth = $('#net_worth')
        .val()
        .trim()
        .replace(/\,/g, '')
        / 1000;

      let annualIncome = $('#annual_income')
        .val()
        .trim()
        .replace(/\,/g, '') / 1000;

      let data = {
        net_worth: netWorth,
        annual_income: annualIncome
      };

      api.makeRequest(authServer + '/rest-auth/data', 'PATCH', data).done((data) => {
        this.user.net_worth = netWorth;
        this.user.annual_income = annualIncome;

        this.initMaxAllowedAmount();
        $('span.current-limit').text(this._maxAllowedAmount.toLocaleString('en-US'));
        this.$amount.data('max', this._maxAllowedAmount);

        this.$amount.keyup();
      }).fail((xhr, status, text) => {
        alert('Update failed. Please try again!');
      });
    },

    getSignature () {
      const investForm = document.forms.invest_form;
      const inputSignature = investForm.elements['signature[full_name]'];
      const signature = inputSignature.value;
      return signature;
    },

    copyToSignature(e) {
      const signature = this.getSignature();
      this.$('.signature').text(signature);
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

    changeCountry(e) {
      const isUS = e.target.value === 'US';

      let $row = isUS ? $('.other-countries-fields') : $('.us-fields');

      if (!$row.length)
        return;

      let args = {
        fields: this.fields,
        user: this.user,
      };

      $row.after(isUS ? this.snippets.us(args) : this.snippets.nonUs(args));

      $row.remove();
    },

    submit(e) {
      e.preventDefault();

      let data = $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });
      data.amount = data.amount.replace(/\,/g, '');
      if(data['payment_information_type'] == '1' || data['payment_information_type'] == 2) {
        delete data['payment_information_data'];
        // Temp solution !
        delete this.fields.payment_information_data;
      }
      api.submitAction.call(this, e, data);
    },

    getSuccessUrl(data) {
      return data.id + '/invest-thanks';
    },

    saveEsign(responseData) {
      const reqUrl = global.esignServer + '/pdf-doc';
      const successRoute = this.getSuccessUrl(responseData);
      const formData = this.getDocMetaData();
      const subscriptionAgreementPath = this.getSubscriptionAgreementPath();
      const participationAgreementPath = 'invest/participation_agreement.pdf';
      const data = [{
        compaign_id: this.model.id,
        type: typeOfDocuments[participationAgreementPath],
        object_id: responseData.id,
        meta_data: formData,
        template: participationAgreementPath
      }, {
        compaign_id: this.model.id,
        type: typeOfDocuments[subscriptionAgreementPath],
        object_id: responseData.id,
        meta_data: formData,
        template: subscriptionAgreementPath
      }];

      app.makeRequest(reqUrl, 'POST', data, {
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
      })
      .done( () => {
        $('#content').scrollTo();
        this.undelegateEvents();
        app.routers.navigate(successRoute, {
            trigger: true,
            replace: false
        });
      })
      .fail( (err) => console.log(err));
    },

    openPdf (e) {
      var pathToDoc = e.target.dataset.path;
      var data = this.getDocMetaData();
      const isSubscriptionAgreement = pathToDoc.indexOf('subscription_agreement');
      
      if (isSubscriptionAgreement !== -1) {
        pathToDoc = global.esignServer + '/pdf-doc/';
        pathToDoc += this.getSubscriptionAgreementPath();
      }
      
      e.target.href = pathToDoc + '?' + $.param(data);
    },

    getSubscriptionAgreementPath () {
      return this.model.campaign.security_type === 0 ?
      'invest/subscription_agreement_common_stok.pdf' :
      'invest/subscription_agreement_revenue_share.pdf';
    },

    getCurrentDate () {
        const date = new Date();
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
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
      // else console.log('hello');
      this.getCityStateByZipCode(e.target.value, ({ success=false, city="", state=""}) => {
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

    getDocMetaData () {
      this.model.owner = this.model.owner || {};

      const formData = $('form.invest_form').serializeJSON();
      const issuer_signer = this.model.owner.first_name + ' ' + this.model.owner.last_name;
      const investor_legal_name = formData.personal_information_data.first_name + ' ' + formData.personal_information_data.last_name;
      const investment_amount = parseInt( formData.amount.replace(/\D/g, '') );
      const investor_number_purchased = investment_amount / this.model.campaign.price_per_share;
      const aggregate_inclusive_purchase = formData.total_amount.replace(/\D/g, '');

      return {
        compaign_id: this.model.id,
        signature: this.getSignature(),

        fees_to_investor: companyFees.fees_to_investor,
        trans_percent: companyFees.trans_percent,
        registration_fee: companyFees.registration_fee,
        commitment_date_x: this.getCurrentDate(),
        // listing_fee: '$500',

        // campaign
        issuer_legal_name: this.model.name,
        city: this.model.city,
        state: this.model.state,
        zip_code: this.model.zip_code,
        address_1: this.model.address_1,
        address_2: this.model.address_2,
        jurisdiction_of_organization: usaStates.getFullState(this.model.founding_state),  
        maximum_raise: formatHelper.formatNumber( this.model.campaign.maximum_raise ),
        minimum_raise: formatHelper.formatNumber( this.model.campaign.minimum_raise ),
        price_per_share: formatHelper.formatNumber( this.model.campaign.price_per_share ),
        
        // owner of campaign
        issuer_email: this.model.owner.email,
        issuer_signer: issuer_signer,
        // issuer_signer_title: null,

        // investor
        investor_legal_name: investor_legal_name,
        aggregate_inclusive_purchase: formatHelper.formatNumber( aggregate_inclusive_purchase ),
        investment_amount: formatHelper.formatNumber( investment_amount ),
        investor_address: formData.personal_information_data.street_address_1,
        investor_optional_address: formData.personal_information_data.street_address_2,
        investor_code: formData.personal_information_data.zip_code,
        investor_city: formData.personal_information_data.city,
        investor_state: formData.personal_information_data.state,
        investor_email: app.user.get('email'),
        investor_number_purchased: investor_number_purchased,
      };
    },

    _success(data) {
      this.saveEsign(data);
    },

  }),

  investmentThankYou: Backbone.View.extend({
    template: require('./templates/thankYou.pug'),
    el: '#content',
    initialize(options) {
      // this.render();
    },

    render() {
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          Urls: Urls,
          investment: this.model,
        })
      );
      return this;
    },
  }),
};

