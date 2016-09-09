module.exports = {
    createOrUpdate: Backbone.View.extend({
        template: require('templates/companyCreateOrUpdate.pug'),
        events: {
            'submit form': 'submit',
            'keyup #zip_code': 'changeZipCode',
            'click .update-location': 'updateLocation',
            'change input[name=phone]': 'formatPhone',
            'change #website': 'appendHttpIfNecessary',
        },

        initialize: function(options) {
            this.fields = options.fields;
            this.campaign = options.campaign;
              this.$el.on('keypress', ':input:not(textarea)', function(event){
                if(event.keyCode == 13) {
                  event.preventDefault();
                  return false;
                }
              });
        },

        appendHttpIfNecessary: function(e) {
            var $el = $('#website');
            var url = $el.val();
            if (!(url.startsWith("http://") || url.startsWith("https://"))) {
                $el.val("http://" + url);
            }
        },

        formatPhone: function(e){
            this.$('input[name=phone]').val(this.$('input[name=phone]').val().replace(/^\(?(\d{3})\)?-?(\d{3})-?(\d{4})$/, '$1-$2-$3'));
        },

        updateLocation(e) {
            this.$('.js-city-state').text(this.$('.js-city').val() + ', ' + this.$('.js-state').val());
            $("form input[name=city]").val(this.$('.js-city').val())
            $("form input[name=state]").val(this.$('.js-state').val())
        },

        changeZipCode(e) {
            // if not 5 digit, return
            if (e.target.value.length < 5) return;
            if (!e.target.value.match(/\d{5}/)) return;
            this.getCityStateByZipCode(e.target.value, ({ success=false, city="", state=""}) => {
                // this.zipCodeField.closest('div').find('.help-block').remove();
                if (success) {
                    this.$('.js-city-state').text(`${city}, ${state}`);
                    // this.$('#city').val(city);
                    this.$('.js-city').val(city);
                    $("form input[name=city]").val(city);
                    // this.$('#state').val(city);
                    this.$('.js-state').val(state);
                    $("form input[name=state]").val(state);

                } else {
                    console.log("error");
                }
            });
        },

        render: function() {
            this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
            this.usaStates = require("helpers/usa-states");
            this.$el.html(
                this.template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model.toJSON(),
                    user: app.user.toJSON(),
                    campaign: this.campaign,
                    states: this.usaStates,
                })
            );
            return this;
        },

        _success: function(data) {            
            // IF we dont have campaign we need create it
            app.makeRequest('/api/campaign/general_information').
                then((campaigns) => {
                    if(campaigns.length > 0) {
                        app.routers.navigate(
                            '/campaign/general_information/' + campaigns[0].id,
                            {trigger: true, replace: false}
                        );
                    } else {
                        app.makeRequest('/api/campaign/general_information', {
                            company: data.id,
                            business_model: '',
                            intended_use_of_proceeds: '',
                            pitch: ''
                        }, 'POST').
                            then((campaign) => {
                                app.routers.navigate(
                                    '/campaign/general_information/' + campaign.id,
                                    {trigger: true, replace: false}
                                );
                            })
                    }
                })
        },

        submit: app.defaultSaveActions.submit,

    }),
};
