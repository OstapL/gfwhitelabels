define('views/menu', function() {
    return {
        menu: Backbone.View.extend({
            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {
                this.$el.html(
                    window.menuPage({
                        serverUrl: serverUrl,
                        user: app.user,
                        Urls: Urls,
                    })
                );
                return this;
            },
        }),

        profile: Backbone.View.extend({
            events: {
                'click .logout': 'logout',
            },

            initialize: function(options) {
                this.template = options.template;
            },

            logout: function(event) {
                app.routers.navigate(
                    event.target.pathname, 
                    {trigger: true, replace: false}
                );
            },

            render: function() {
                this.$el.html(
                    window.menuProfile({
                        serverUrl: serverUrl,
                        user: app.user.toJSON(),
                        model: app.user,
                        Urls: Urls,
                    })
                );
                return this;
            },
        }),
    }
});
