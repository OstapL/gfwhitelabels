"use strict";

module.exports = { 
    list: Backbone.View.extend({
        template: require('templates/campaignList.pug'),

        initialize: function(options) {
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
                    campaigns: this.collection.toJSON(),
                    collection: this.collection,
                })
            );
            this.$el.find('.selectpicker').selectpicker();
            //selectPicker('.selectpicker');
            return this;
        },
    }),

    detail: Backbone.View.extend({
        template: require('templates/campaignDetail.pug'),

        initialize: function(options) {
            $(document).off("scroll", this.onScrollListener);
            $(document).on("scroll", this.onScrollListener);
        },

        events: {
            'click .tabs-scroll .nav .nav-link': 'smoothScroll',
            'click .list-group-item-action': 'toggleActiveAccordionTab',
            'click .linkedin-share': 'shareOnLinkedin',
            'click .facebook-share': 'shareOnFacebook',
            'click .twitter-share': 'shareOnTwitter',
            'click .see-all-risks': 'seeAllRisks',
            'click .see-all-faq': 'seeAllFaq',
        },

        seeAllRisks: function(e){
            e.preventDefault();
            this.$('.risks .collapse').collapse('show');
        },

        seeAllFaq: function(e){
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
                window.location.hash = e.target.hash;
                $(document).on("scroll", this.onScrollListener);
            });
        },

        toggleActiveAccordionTab(e) {
            let $elem = $(e.target),
                $icon = $elem.find('.fa');

            if ($elem.is('.active')) {
                $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
            } else {
                // remove active state of all other panels
                $elem.closest('.custom-accordion').find('.list-group-item-action').removeClass('active')
                    .find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

                $icon.removeClass('fa-angle-down').addClass('fa-angle-up');
            }
            $elem.toggleClass('active');
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

        shareOnFacebook(event) {
            event.preventDefault();
            FB.ui({
              method: 'share',
              href: window.location.href,
              caption: this.model.get('company').tagline,
              description: this.model.get('pitch'),
              title: this.model.get('company').name,
              picture: (this.model.get("header_image_data") ? this.model.get("header_image_data").url : null),
            }, function(response){});
        },

        shareOnLinkedin(event) {
            event.preventDefault();
            window.open(encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href +
                '&title=' + this.model.get('company').name +
                '&summary=' + this.model.get('pitch') +
                '&source=Growth Fountain'),'Growth Fountain Campaingn','width=605,height=545');
        },

        shareOnTwitter(event) {
            event.preventDefault();
            window.open(encodeURI('https://twitter.com/share?url=' + window.location.href +
                '&via=' + 'growthfountain' +
                '&hashtags=investment,fundraising' +
                '&text=Check out '),'Growth Fountain Campaingn','width=550,height=420');
        },

        render() {
            //require('node_modules/photoswipe/src/css/main.scss');
            //require('node_modules/photoswipe/src/css/default-skin/default-skin.scss');
            const socialMediaScripts = require('helpers/shareButtonHelper.js');

            //let PhotoSwipe = require('photoswipe');
            //let PhotoSwipeUI_Default = require('photoswipe-ui-default');


            this.$el.html(
                this.template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    campaign: this.model.toJSON(),
                    model: this.model
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

                let photoswipeRun = require('components/campaign/photoswipe_run.js');
                /*
                window.PhotoSwipe = PhotoSwipe;
                window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
                photoswipeRun('#gallery1');
                */
            }, 100);
            this.$el.find('.perks .col-lg-4 p').equalHeights()
            this.$el.find('.team .auto-height').equalHeights()
            this.$el.find('.modal').on('hidden.bs.modal', function(event) {
                $(event.currentTarget).find('iframe').attr('src', $(event.currentTarget).find('iframe').attr('src'));
            });

            return this;
        },

        /*
        preloadTabContent: function(event) {
            let name = event.target.dataset.url; 
            $.ajax({                                                       
              url: serverUrl + '/api/campaign/' + this.model.get('id') + '/get_' + name,                   
              typeData: 'json',                                            
              success: (response) => {                                     
                $('#' + name).html(_.template(                            
                    $('#' + name + '_template').html()                     
                )({'campaign': response}));
              }                                                         
            });                                                            
            if(app.hasOwnProperty(name) == false) {                    
            }   
        }
        */
    }),

    investment: Backbone.View.extend({
        template: require('templates/campaignInvestment.pug'),
        events: {
            'submit form': 'submit',
            'keyup #amount': 'amountUpdate',
            'keyup #zip_code': 'changeZipCode',
            'click .update-location': 'updateLocation'
        },
        initialize: function(options) {
            this.campaignModel = options.campaignModel;
            this.fields = options.fields;
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
                    campaignModel: this.campaignModel,
                    campaign: this.campaignModel.toJSON(),
                    user: app.user.toJSON(),
                    states: this.usaStates
                })
            );
            return this;
        },

        submit(e) {
            this.$el.find('.alert').remove();
            event.preventDefault();

            var data = $(e.target).serializeObject();
            //var investment = new InvestmentModel(data);

            this.model.set(data);
            this.model.set('campaign', this.campaignModel.get('id'));
            this.model.set('user', app.user.get('id'));
            Backbone.Validation.bind(this, {model: this.model});
            var campaignModel = this.campaignModel;

            if(this.model.isValid(true)) {
                var self = this;
                this.model.save().
                    then((data) => { 
                        app.showLoading();

                        self.undelegateEvents();
                        $('#content').scrollTo();
                        app.routers.navigate(
                            Urls['investment-detail'](data.id),
                            {trigger: false, replace: false}
                        );

                        let template = require('templates/investmentThankYou.pug');
                        $('#content').html(template({
                            Urls: Urls,
                            investment: data,
                            campaign: campaignModel.toJSON()
                        }));
                        app.cache[window.location.pathname] = $('#content').html();
                        app.hideLoading();
                    });
            } else {
                if(this.$('.alert').length) {
                    this.$('.alert').scrollTo();
                } else  {
                    this.$el.find('.has-error').scrollTo();
                }
            }
        },

        amountUpdate(e) {
            var amount = parseInt(e.currentTarget.value);
            if(amount >= 5000) {

                $('#amount').popover({
                    // trigger: 'focus',
                    placement: function(context, src) {
                        $(context).addClass('amount-popover');
                        return 'top';
                    },
                    html: true,
                    content: function(){
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
                    $('.perk').removeClass('active');
                    $('.perk .fa-check').remove();
                    el.classList.add('active');
                    $(el).find('.list-group-item-heading').append('<i class="fa fa-check"></i>');
                }
            });
        }
    }),

    investmentThankYou: Backbone.View.extend({
        template: require('templates/investmentThankYou.pug'),
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
}
