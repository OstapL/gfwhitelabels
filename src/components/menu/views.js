"use strict";
module.exports = {
    menu: Backbone.View.extend({
        template: require('templates/menuPage.pug'),
        render: function() {
            this.$el.html(
                this.template({
                    serverUrl: serverUrl,
                    user: app.user.toJSON(),
                    Urls: Urls,
                })
            );
            return this;
        },
    }),

    profile: Backbone.View.extend({
        template: require('templates/menuProfile.pug'),
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
                this.template({
                    serverUrl: serverUrl,
                    user: app.user.toJSON(),
                    Urls: Urls,
                })
            );
            return this;
        },
    }),

    notification: Backbone.View.extend({
        template: require('templates/menuNotification.pug'),
        render: function() {
            if(app.user.token) {

                this.$el.html(
                    this.template({
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
};
