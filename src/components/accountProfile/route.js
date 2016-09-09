module.exports = Backbone.Router.extend({
    routes: {
        'account/profile': 'accountProfile',
        'account/logout': 'logout',
        'account/change-password': 'changePassword',
        'account/new-password': 'setNewPassword'
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

    changePassword: function() {
        require.ensure([], function() {
            const view = require('components/accountProfile/views.js');
            let i = new view.changePassword({
                el: '#content',
            });
            i.render();
            app.hideLoading();
        });
    },

    setNewPassword: function() {
        require.ensure([], function() {
            const view = require('components/accountProfile/views.js');
            let model = new userModel({id: app.user.pk});
            model.baseUrl = '/api/password/reset';
            let i = new view.setNewPassword({
                el: '#content',
                model: model
            });
            i.render();
            app.hideLoading();
        });
    },
});    
