define(function() {
    return {
        campaign: Backbone.View.extend({

            initialize: function(options) {
            },

            render: function() {

                this.$el.html(
                    window.investmentCampaign({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        model: this.model
                    })
                );
                return this;
            },
        }),
    }
});
