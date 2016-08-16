define('views/menu', function() {
    return {
        menu: Backbone.View.extend({
            render: function() {

                let template = require('templates/menuPage.pug');
                console.log('js', app.user.toJSON());
                this.$el.html(
                    template({
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

                let template = '';
                template = require('templates/menuProfile.pug');

                this.$el.html(
                    template({
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
                if(app.user.token) {
                    let template = require('templates/menuNotification.pug');

                    this.$el.html(
                        template({
                            serverUrl: serverUrl,
                            user: app.user.toJSON(),
                            nofiticaiton: [],
                            Urls: Urls,
                        })
                    );
                }
                return this;
            },
        }),
    }
});
