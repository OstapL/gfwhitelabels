define(function() {
    return {
        list: Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection;
            },

            render: function() {
                //require('sass/pages/_campaing.sass');

                require('../../../node_modules/bootstrap-select/sass/bootstrap-select.scss');

                let selectPicker = require('bootstrap-select');
                this.$el.html('');
                let template = require('templates/campaignList.pug');
                this.$el.append(
                    template({
                        serverUrl: serverUrl,
                        campaigns: this.collection.toJSON()
                    })
                );
                this.$el.find('.selectpicker').selectpicker();
                //selectPicker('.selectpicker');
                return this;
            },
        }),

        detail: Backbone.View.extend({

            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {
                app.loadCss('/css/photoswipe.css');
                app.loadCss('/css/default-skin.css');
                let PhotoSwipe = require('photoswipe');
                let PhotoSwipeUI_Default = require('photoswipe-ui-default');

                let template = require('templates/campaignDetail.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        campaign: this.model.toJSON()
                    })
                );

                $('.nav-tabs li').click(function (e) {
                    $('.nav-tabs li').removeClass('active');
                    $(this).addClass('active');
                });

                setTimeout(() => {
                    let photoswipeRun = require('photoswipe_run.js');
                    window.PhotoSwipe = PhotoSwipe;
                    window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
                    initPhotoSwipeFromDOM('#gallery1');

                }, 100);

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
            events: {
                'submit form': 'submit',
                'keyup #amount': 'amountUpdate',
            },
            initialize: function(options) {
                this.campaignModel = options.campaignModel;
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignInvestment.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaignModel: this.campaignModel,
                        campaign: this.campaignModel.toJSON(),
                        user: app.user.toJSON()
                    })
                );
                return this;
            },

            submit: function(e) {
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
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            app.routers.navigate(
                                Urls['investment-detail'](data.id),
                                {trigger: false, replace: false}
                            );

                            let template = require('templates/investmentThankYou.pug');
                            console.log('Urls', Urls);
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

            amountUpdate: function(e) {
                var amount = parseInt(e.currentTarget.value);
                if(amount >= 5000) {

                    $('#amount').popover({
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
            initialize: function(options) {
                this.template = options.template;
                this.campaignModel = options.campaignModel;
            },

            render: function() {
                let template = require('templates/investmentThankYou.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        investment: this.model,
                        campaign: this.campaignModel.attributes,
                    })
                );
                return this;
            },
        }),

        generalInformation: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignGeneralInformation.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaign: this.model.toJSON(),
                    })
                );
                return this;
            },
        }),

        media: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignMedia.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaign: this.model.toJSON(),
                    })
                );
                return this;
            },
        }),

        teamMembers: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignTeamMembers.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaign: this.model.toJSON(),
                    })
                );
                return this;
            },
        }),

        specifics: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignSpecifics.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaign: this.model.toJSON(),
                    })
                );
                return this;
            },
        }),

        perks: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignPerks.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaign: this.model.toJSON(),
                    })
                );
                return this;
            },
        })

    }
});
