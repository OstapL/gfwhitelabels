define(function() {
    return {
        detail: Backbone.View.extend({
            initialize: function(options) {
                this.related_pages = options.related_pages;
            },
            render: function() {
                let template = require('templates/pageDetail.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        page: this.model.toJSON(),
                        related_pages: this.related_pages,
                    })
                );
                return this;
            },
        }),
    }
});
