define(function() {
    return {
        list: Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection;
            },

            render: function() {
                loadCss('/css/bootstrap-select.css');
                require(['js/bootstrap-select',], () => {
                    this.$el.html('');
                    this.$el.append(
                        window.campaignList({
                            serverUrl: serverUrl,
                            campaigns: this.collection.toJSON()
                        })
                    );
                    this.$el.find('.selectpicker').selectpicker()
                });
                return this;
            },
        }),

        detail: Backbone.View.extend({

            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {
                loadCss('/css/photoswipe.css');
                loadCss('/css/default-skin.css');
                require([
                    '/js/photoswipe.js', 
                    '/js/photoswipe-ui-default.js', 
                    ], (appears, PhotoSwipe, PhotoSwipeUI_Default) => {
                        this.$el.html(
                            _.template(this.template)({
                                serverUrl: serverUrl,
                                Urls: Urls,
                                model: this.model.toJSON()
                            })
                        );

                        $('.nav-tabs li').click(function (e) {
                            $('.nav-tabs li').removeClass('active');
                            $(this).addClass('active');
                        });

                        setTimeout(() => {
                            require(['/js/photoswipe_run.js',], () => {
                                window.PhotoSwipe = PhotoSwipe;
                                window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
                                initPhotoSwipeFromDOM('#gallery1');
                            });

                        }, 100);
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
            events: {
                'submit form': 'submit',
            },
            initialize: function(options) {
                this.campaignModel = options.campaignModel;
            },

            render: function() {
                this.$el.html(
                    window.campaignInvestment({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        campaignModel: this.campaignModel,
                        campaign: this.campaignModel.toJSON()
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

                if(this.model.isValid(true)) {
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            app.routers.navigate(
                                Urls['investment-detail'](data.id),
                                {trigger: false, replace: false}
                            );

                            app.views.investment = {};
                            app.views.investment = new this.investmentThankYou({
                                el: '#content',
                                model: data,
                                campaignModel: this.campaignModel,
                            });
                            app.views.investment.render();
                            app.cache[window.location.pathname] = app.views.investment.$el.html();
                            app.hideLoading();
                        });
                } else {
                    this.$el.find('.has-error').scrollTo();
                }
            },
        }),

        investmentThankYou: Backbone.View.extend({
            initialize: function(options) {
                this.template = options.template;
                this.campaignModel = options.campaignModel;
            },

            render: function() {
                this.$el.html(
                    window.campaignInvestmentThankYou({
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
});
