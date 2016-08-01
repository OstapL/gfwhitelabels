define(function() {
    return {
        detail: Backbone.View.extend({
            render: function() {
                this.$el.html(
                    window.pageDetail({
                        serverUrl: serverUrl,
                        page: this.model.toJSON()
                    })
                );
                return this;
            },
        }),
    }
});
