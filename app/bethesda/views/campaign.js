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
                    ], (PhotoSwipe, PhotoSwipeUI_Default) => {
                        this.$el.html(
                            window.campaignDetail({
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
                'keyup #amount': 'amountUpdate',
            },
            initialize: function(options) {
                this.campaignModel = options.campaignModel;
                this.fields = options.fields;
            },

            render: function() {
                this.$el.html(
                    window.campaignInvestment({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
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

                            $('#content').html(investmentThankYou({
                                investment: data,
                                campaign: this.campaignModel.toJSON()
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
                    alert('show popover');
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
