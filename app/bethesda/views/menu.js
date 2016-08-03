define('views/menu', function() {
    return {
        menu: Backbone.View.extend({
            render: function() {
                this.$el.html(
                    window.menuPage({
                        serverUrl: serverUrl,
                        user: app.user.toJSON(),
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
                        Urls: Urls,
                    })
                );
                return this;
            },
        }),

        notification: Backbone.View.extend({
            render: function() {
                this.$el.html(
                    window.menuNotification({
                        serverUrl: serverUrl,
                        user: app.user.toJSON(),
                        nofiticaiton: [],
                        Urls: Urls,
                    })
                );
                return this;
            },
        }),
    }
});
