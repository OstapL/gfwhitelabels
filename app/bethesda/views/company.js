define(function() {
    return {

        createOrUpdate: Backbone.View.extend({
            events: {
                'submit form': 'submit',
            },
            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                this.$el.html(
                    window.companyCreateOrUpdate({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
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
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            app.routers.navigate(
                                Urls['campaign-list'](campaign.id),
                                {trigger: true, replace: true}
                            );

                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            },

        }),
    }
});
