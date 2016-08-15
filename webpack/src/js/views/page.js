define(function() {
    return {
        detail: Backbone.View.extend({
            initialize: function(options) {
                this.related_pages = options.related_pages;
            },
            render: function() {
                this.$el.html(
                    window.pageDetail({
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
