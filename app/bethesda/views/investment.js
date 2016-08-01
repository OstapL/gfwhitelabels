define(function() {
    return {
        detail: Backbone.View.extend({

            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {

                this.$el.html(
                    _.template(this.template)({
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
