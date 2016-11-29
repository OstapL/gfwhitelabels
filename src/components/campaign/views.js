const formatHelper = require('helpers/formatHelper');
const textHelper = require('helpers/textHelper');

module.exports = { 
  list: Backbone.View.extend({
    el: '#content',
    template: require('./templates/list.pug'),
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
          companies: this.collection,
        })
      );
      this.$el.find('.selectpicker').selectpicker();
      //selectPicker('.selectpicker');
      return this;
    },
  }),

  detail: Backbone.View.extend({
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
      'click .linkresponse': 'checkResponse',
      'click .show-more-members': 'readMore',
      // 'click .see-all-article-press': 'seeAllArticlePress',
      'click .more-less': 'showMore',
      'hidden.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
      'shown.bs.collapse #hidden-article-press' :'onArticlePressCollapse',
      'submit .comment-form': 'submitComment',
      'click .submit_form': 'submitCampaign',
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
    },

    submitCampaign(e) {

      api.makeRequest(
        serverUrl + '/api/campaign/general_information/' + this.model.id,
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
      // Check out COMPANY NAME's fundraise on GrowthFountain
      let companyName = this.model.name;
      let text = "Check out " + companyName + "'s fundraise on GrowthFountain";
      window.open("mailto:?subject=" + text + "&body=" + text + "%0D%0A" + window.location.href);
    },

    shareOnFacebook(event) {
      event.preventDefault();
      FB.ui({
        method: 'share',
        href: window.location.href,
        caption: this.model.tagline,
        description: this.model.description,
        title: this.model.name,
        picture: (this.model.campaign.header_image_data.url ? this.model.campaign.header_image_data.url : null),
      }, function(response){});
    },

    shareOnLinkedin(event) {
      event.preventDefault();
      window.open(encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href +
            '&title=' + this.model.name +
            '&summary=' + this.model.description +
            '&source=Growth Fountain'),'Growth Fountain Campaign','width=605,height=545');
    },

    shareOnTwitter(event) {
      event.preventDefault();
      window.open(encodeURI('https://twitter.com/share?url=' + window.location.href +
            '&via=' + 'growthfountain' +
            '&hashtags=investment,fundraising' +
            '&text=Check out '),'Growth Fountain Campaign','width=550,height=420');
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

        this.commentView = require('components/comment/views.js');

        $('#ask').after(
          new this.commentView.form().getHtml({model: {}})
        );

        var a1 = api.makeCacheRequest(Urls['comment-list']() + '?company=' + this.model.company.id).
          then((comments) => {
            let commentList = new this.commentView.list({
              el: '.comments',
              model: this.model.company,
              collection: comments,
            }).render();
          });
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

      return this;
    },

    readMore(e) {
      e.preventDefault();
      $(e.target).parent().addClass('show-more-detail');
    },

    _commentSuccess(data) {
      this._success = null;
      this.urlRoot = null;
      if (data.parent) { 
        $('#comment_' + data.parent).after(
          new this.commentView.detail().getHtml({
            model: data,
            company: this.model.company,
            app: app,
          })
        );
      } else {
        $('#comment_' + data.parent).html(
          new this.commentView.detail().getHtml({
            company: this.model.company,
            model: data,
            app: app,
          })
        );
      }
      this.$el.find('.comment-form-div').remove();
      app.hideLoading();
      app.showLoading = this._showLoading;
    },

    checkResponse(e) {
      e.preventDefault();
      this.$el.find('.comment-form-div').remove();
      var $el = $(e.currentTarget);
      $el.parents('.comment').after(
        new this.commentView.form({
        }).getHtml({
          model: {parent: e.currentTarget.dataset.id},
          company: this.model.company,
          app: app,
        })
      );
    },

    submitComment(e) {
      e.preventDefault();
      var data = $(e.target).serializeJSON();
      let model = new Backbone.Model();
      model.urlRoot = serverUrl + Urls['comment-list']();
      data['company'] = this.model.company.id;
      model.set(data)
      if (model.isValid(true)) {
        model.save().
          then((data) => {
            this.$el.find('.alert-warning').remove();
            this._commentSuccess(data);
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
    }
  }),

  investment: Backbone.View.extend({
    template: require('./templates/investment.pug'),
    templatesOfPdf: {
      revenue_share: require('./templates/agreement/revenue_share.pug'),
      common_stock: require('./templates/agreement/common_stock.pug'),
    },
    urlRoot: investmentServer + '/',
    events: {
      // 'submit form.invest_form': api.submitAction,
      'submit form.invest_form': 'submit',
      'keyup #amount': 'amountUpdate',
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .link-2': 'openPdf',
      'change .country-select': 'changeCountry',
      'change .payment-type-select': 'changePaymentType',
    },

    changePaymentType(e) {
      let val = $(e.target).val();
      if (val == 'echeck') {
        $('.echeck-fields').show();
        $('.check-fields').hide();
      } else {
        $('.check-fields').show();
        $('.echeck-fields').hide();
      }
    },

    changeCountry(e) {
      let val = $(e.target).val();
      if (val == 'us') {
        $('.us-fields').show();
        $('.other-countries-fields').hide();
      } else {
        $('.us-fields').hide();
        $('.other-countries-fields').show();
      }
    },

    submit(e) {
      e.preventDefault();
      let data = $(e.target).serializeJSON();
      data.doNotExtendModel = true;
      api.submitAction.call(this, e, data);
    },

    getSuccessUrl(data) {
      return '/invest_thanks';
    },
    initialize(options) {
      this.fields = options.fields;
      // this.fields.street_address_1 = { type: 'string', required: true};
      this.fields.street_address_1 = { type: 'string', required: false};
      this.fields.street_address_2 = { type: 'string', required: false};
      // this.fields.phone = {type: 'string', required: true};
      this.fields.phone = {type: 'string', required: false};
      // this.fields.name_on_bank_account = {type: 'string', required: true};
      this.fields.name_on_bank_account = {type: 'string', required: false};
      // this.fields.account_number = {type: 'string', required: true};
      this.fields.account_number = {type: 'string', required: false};
      // this.fields.account_number_re = {type: 'string', required: true};
      this.fields.account_number_re = {type: 'string', required: false};
      // this.fields.zip_code = {type: 'string', required: true};
      this.fields.zip_code = {type: 'string', required: false};
      // this.fields.city = {type: 'string', required: true};
      this.fields.city = {type: 'string', required: false};
      this.fields.fee = {type: 'int', required: false};
      // this.fields.route_number = {type: 'string', required: true};
      this.fields.routing_number = {type: 'string', required: false};
      this.labels = {
        amount: 'Amount',
        street_address_1: 'Street Address 1',
        street_address_2: 'Street Address 2',
        zip_code: 'Zip Code',
        city: 'City',
        phone: 'Phone',
        name_on_bank_account: 'Name On Bank Account',
        account_number: 'Account Number',
        account_number_re: 'Account Number Again',
        fee: 'Fee',
        routing_number: 'Routing Number',
      };
      this.assignLabels();
    },

    openPdf (e) {
      const investor_legal_name = $('#first_name').val() + $('#last_name').val()
                      || app.user.get('first_name') + app.user.get('last_name');
      var data = {
        address_1: $('#street_address_1').val(),
        address_2: $('#street_address_2').val(),
        aggregate_inclusive_purchase: $('#total').val(),
        city: $('#city').val(),
        investor_total_purchase: $('#amount').val(),
        investor_legal_name: investor_legal_name,
        state: $('#state').val(),
        zip_code: $('#zip_code').val(),
        Commitment_Date_X: this.getCurrentDate(),
        fees_to_investor: 10,
        investor_address: app.user.get('address_1'),
        investor_city: app.user.get('city'),
        investor_code: app.user.get('zip_code'),
        investor_email: app.user.get('email'),
        Investor_optional_address: app.user.get('address_2'),
        investor_state: app.user.get('state'),
        investor_number_purchased: '',
        Investor_optional_address: '',
        investor_state: '',
        issuer_email: '',
        issuer_legal_name: '',
        issuer_signer: '',
        issuer_signer_title: '',
        jurisdiction_of_organization: '',
        listing_fee: '',
        maximum_raise: '',
        minimum_raise: '',
        price_per_share: '',
        registration_fee: '',
      };
      const tplName = e.target.dataset.tpl;
      const tpl = this.templatesOfPdf[tplName];
      var docTxt = tpl(data);
      var doc = JSON.parse(docTxt);

      window.pdfMake
        .createPdf(doc)
        .download(e.target.text, () => app.hideLoading());
      
      app.showLoading()
      e.preventDefault();
    },

    getCurrentDate () {
        const date = new Date();
        return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    },

    updateLocation(e) {
      this.$('.js-city-state').text(this.$('.js-city').val() + ', ' + this.$('.js-state').val());
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
          // this.$('#city').val(city);
          this.$('.js-city').val(city);
          // this.$('#state').val(city);
          this.$('.js-state').val(state);

        } else {
          console.log("error");
        }
      });
    },

    render() {
      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = require("helpers/usa-states");
      this.$el.html(
          this.template({
            serverUrl: serverUrl,
            Urls: Urls,
            fields: this.fields,
            values: this.model,
            user: app.user.toJSON(),
            states: this.usaStates
          })
          );
      return this;
    },

    amountUpdate(e) {
      var amount = parseInt(e.currentTarget.value);
      if(amount >= 5000) {

        $('#amount').popover({
          // trigger: 'focus',
          placement(context, src) {
            $(context).addClass('amount-popover');
            return 'top';
          },
          html: true,
          content(){
            var content = $('.invest_form').find('.popover-content-amount-campaign').html();
            return content;
          }
        });

          $('#amount').popover('show');
        } else {
          $('#amount').popover('dispose');
        }

        this.$('.perk').each((i, el) => {
          if(parseInt(el.dataset.from) <= amount) {
            $(el).addClass('active').find('i.fa.fa-check').show();
          } else {
            $(el).removeClass('active').find('i.fa.fa-check').hide();
          }
        });

        // Here 10 is the flat rate;
        const totalAmount = Number(this.$('input[name=amount]').val()) + 10;
        this.$('.total-investment-amount').text('$' + totalAmount);
      }
  }),

  investmentThankYou: Backbone.View.extend({
    template: require('./templates/thankYou.pug'),
    initialize(options) {
      this.campaignModel = options.campaignModel;
    },

    render() {
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          Urls: Urls,
          investment: this.model,
          campaign: this.campaignModel.attributes,
        })
      );
      return this;
    },
  }),
};

