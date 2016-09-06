module.exports = Backbone.Router.extend({
    routes: {
        'account/profile': 'accountProfile',
        'account/logout': 'logout',
    },

    accountProfile() {
        if(!app.user.is_anonymous()) {
            require.ensure([], function() {
                const view = require('components/accountProfile/views.js');

                $.ajax(_.extend({
                        url: serverUrl + Urls['rest_user_details'](),
                    }, app.defaultOptionsRequest)
                ).done((response) => {
                    var i = new view.profile({
                        el: '#content',
                        model: app.user,
                        fields: response.actions.PUT
                    });
                    i.render();
                    //app.views.campaign[id].render();
                    //app.cache[window.location.pathname] = i.$el.html();

                    app.hideLoading();
                });
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    logout(id) {
        // ToDo
        // Do we really want have to wait till user will be ready ?
        app.user.logout();
        app.on('userLogout', function() {
            window.location = '/';
        });
    },
});    
