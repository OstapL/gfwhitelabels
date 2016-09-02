"use strict";
define(function() {
    return {

        createOrUpdate: Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'keyup #zip_code': 'changeZipCode',
                'click .update-location': 'updateLocation'
            },
            initialize: function(options) {
                this.fields = options.fields;
                this.campaign = options.campaign;
            },

            updateLocation: function(e) {
                this.$('.js-city-state').text(this.$('.js-city').val() + ', ' + this.$('.js-state').val());
            },

            changeZipCode: function(e) {
                // if not 5 digit, return
                if (e.target.value.length < 5) return;
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

            render: function() {
                this.getCityStateByZipCode = require("../helpers/getSityStateByZipCode");
                this.usaStates = require("../helpers/usa-states");
                let template = require('templates/companyCreateOrUpdate.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        values: this.model.toJSON(),
                        user: app.user.toJSON(),
                        campaign: this.campaign,
                        states: this.usaStates
                    })
                );
                return this;
            },

            getSuccessUrl: function(data) {
                return '/campaign/general_information/?company_id=' + data.id;
            },

            submit: app.defaultSaveActions.submit,

        }),
    }
});
