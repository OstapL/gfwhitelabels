"use strict";
define(function() {
    return {

        createOrUpdate: Backbone.View.extend({
            events: {
                'submit form': 'submit',
            },
            initialize: function(options) {
                this.fields = options.fields;
                this.campaign = options.campaign;
            },

            render: function() {
                let template = require('templates/companyCreateOrUpdate.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        values: this.model.toJSON(),
                        user: app.user.toJSON(),
                        campaign: this.campaign
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
