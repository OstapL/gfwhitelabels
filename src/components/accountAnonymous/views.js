module.exports = {
    login: Backbone.View.extend({
        events: {
            'submit .login-form': 'submit',
            'click .btn-google': 'loginGoogle',
            'click .btn-linkedin': 'loginLinkedin',
            'click .btn-facebook': 'loginFacebook'
        },

        initialize: function(options) {
            this.login_fields = options.login_fields;
            this.hello = require('hellojs');
            this.socialAuth = require('js/views/social-auth.js');
        },

        render: function() {
            this.model.urlRoot = serverUrl + Urls['rest_login']();
            let template = require('templates/userLogin.pug');
            this.$el.html(
                template({
                    login_fields: this.login_fields,
                })
            );
            return this;
        },

        _success: function(data) {
            if(data.hasOwnProperty('key')) {
                localStorage.setItem('token', data.key);
                setTimeout(function() {
                    window.location = '/' //data.next ? data.next : '/account/profile'
                }, 200);
            } else {
                Backbone.Validation.callbacks.invalid(                                 
                  form, '', 'Server return no authentication data'
                );
            }
        },

        submit: app.defaultSaveActions.submit,
        loginGoogle: function() {

            var self = this;

            self.hello('google').login({
                scope: 'profile,email'}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('google', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {

                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {
                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });
        },
        loginFacebook: function() {

            var self = this;

            self.hello('facebook').login({
                scope: 'public_profile,email'}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('facebook', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });

        },
        loginLinkedin: function() {

            var self = this;

            self.hello('linkedin').login({
                scope: 'r_basicprofile,r_emailaddress',}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('linkedin', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });

        }

    }),

    signup: Backbone.View.extend({
        events: {
            'submit .signup-form': 'submit',
            'click .btn-google': 'loginGoogle',
            'click .btn-linkedin': 'loginLinkedin',
            'click .btn-facebook': 'loginFacebook'
        },

        initialize: function(options) {
            this.register_fields = options.register_fields;
            this.hello = require('hellojs');
            this.socialAuth = require('js/views/social-auth.js');
        },

        render: function() {
            this.model.urlRoot = serverUrl + Urls['rest_register']();
            let template = require('templates/userSignup.pug');
            this.$el.html(
                template({
                    register_fields: this.register_fields,
                })
            );
            return this;
        },

        _success: function(data) {
            if(data.hasOwnProperty('key')) {
                localStorage.setItem('token', data.key);

                delete this.model.attributes['password1'];
                delete this.model.attributes['password2'];
                delete this.model.attributes['key'];

                this.model.set('token', data.key);
                localStorage.removeItem('user');
                window.location = '/' //data.next ? data.next : '/account/profile'
            } else {
                Backbone.Validation.callbacks.invalid(                                 
                  this, '', 'Server return no authentication data'
                );
            }
        },

        submit: app.defaultSaveActions.submit,
        loginGoogle: function() {

            var self = this;

            self.hello('google').login({
                scope: 'profile,email'}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('google', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {

                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {
                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });
        },
        loginFacebook: function() {

            var self = this;

            self.hello('facebook').login({
                scope: 'public_profile,email'}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('facebook', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });

        },
        loginLinkedin: function() {

            var self = this;

            self.hello('linkedin').login({
                scope: 'r_basicprofile,r_emailaddress',}).then(
                function (e) {
                    var sendToken = self.socialAuth.sendToken('linkedin', e.authResponse.access_token);

                    $.when(sendToken).done(function (data) {
                        localStorage.setItem('token', data.key);
                        window.location = '/account/profile';
                    }).fail(function (data) {
                        app.defaultSaveActions.error(self, data);
                    });
                },
                function (e) {

                    // TODO: notificate user about reason of error;
                    app.routers.navigate(
                        '/account/login',
                        {trigger: true, replace: true}
                    );
                });

        }
    }),
};
