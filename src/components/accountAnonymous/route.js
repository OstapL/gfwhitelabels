module.exports = Backbone.Router.extend({
    routes: {
        'account/login': 'login',
        'account/signup': 'signup',
        'account/facebook/login/': 'loginFacebook',
        'account/google/login/': 'loginGoogle',
        'account/linkedin/login/': 'loginLinkedin',
        'account/finish/login/': 'finishSocialLogin',
        'account/reset': 'resetPassword',
        'account/change-password': 'changePassword',
    },

    login(id) {
        require.ensure([], function() {
            const view = require('components/accountAnonymous/views.js');
            var a1 = $.ajax(_.extend({
                    url: serverUrl + Urls['rest_login'](),
                }, app.defaultOptionsRequest));
            var a2 = $.ajax(_.extend({
                    url: serverUrl + Urls['rest_register'](),
                }, app.defaultOptionsRequest));
            $.when(a1, a2).done((r1, r2) => {
                let loginView = new view.login({
                    el: '#content',
                    login_fields: r1[0].actions.POST,
                    register_fields: r2[0].actions.POST,
                    model: new userModel(),
                });
                loginView.render();
                app.hideLoading();
            }).fail((xhr, error) => {
                // ToDo
                // Show global error message
                console.log('cant get fields ');
                console.log(xhr, error);
                app.hideLoading();
            });
        });
    },

    signup(id) {
        require.ensure([], function() {
            const view = require('components/accountAnonymous/views.js');
            var a2 = $.ajax(_.extend({
                    url: serverUrl + Urls['rest_register'](),
                }, app.defaultOptionsRequest));
            $.when(a2).done((r2) => {
                console.log(r2);
                let signView = new view.signup({
                    el: '#content',
                    register_fields: r2.actions.POST,
                    model: new userModel(),
                });
                signView.render();
                app.hideLoading();
            }).fail((xhr, error) => {
                // ToDo
                // Show global error message
                console.log('cant get fields ');
                console.log(xhr, error);
                app.hideLoading();
            });
        });
    },

    loginFacebook() {
        require.ensure([], function() {
            const socialAuth = require('js/views/social-auth');
            const hello = require('hellojs');

            hello('facebook').login({
                scope: 'public_profile,email'}).then(
                function (e) {
                    var sendToken = socialAuth.sendToken('facebook', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });
        });

    },

    loginLinkedin() {

        require.ensure([], function() {
            const socialAuth = require('js/views/social-auth.js');
            const hello = require('hellojs');

            hello('linkedin').login({
                scope: 'r_basicprofile,r_emailaddress',
            }).then(
                function (e) {
                    var sendToken = socialAuth.sendToken('linkedin', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                }
            );
        });

    },

    loginGoogle() {
        require.ensure([], function() {

            const socialAuth = require('js/views/social-auth.js');
            const hello = require('hellojs');

            hello('google').login({
                scope: 'profile,email'}).then(
                function (e) {
                    var sendToken = socialAuth.sendToken('google', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });
        });
    },

    finishSocialLogin() {
        require.ensure([], function() {
            const socialAuth = require('js/views/social-auth.js');
            const hello = require('hellojs');
        });
    },

    resetPassword: function() {
        require.ensure([], function() {
            const view = require('components/accountAnonymous/views.js');
            let i = new view.reset({
                el: '#content',
            });
            i.render();
            app.hideLoading();
        });
    },

});    
