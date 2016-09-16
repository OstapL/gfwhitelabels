module.exports = {
  login: Backbone.View.extend({
    events: {
      'submit .login-form': api.submitAction,
      'click .btn-google': 'loginGoogle',
      'click .btn-linkedin': 'loginLinkedin',
      'click .btn-facebook': 'loginFacebook',
    },

    initialize(options) {
      this.login_fields = options.login_fields;
      this.hello = require('hellojs');
      this.socialAuth = require('js/views/social-auth.js');
    },

    render() {
      this.model.urlRoot = serverUrl + Urls['rest_login']();
      let template = require('./templates/login.pug');
      this.$el.html(
        template({
          login_fields: this.login_fields,
        })
      );
      return this;
    },

    _success(data) {
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

    loginGoogle() {
      this.hello('google').login({
        scope: 'profile,email'}).
        then((e) => {
          var sendToken = this.socialAuth.sendToken('google', e.authResponse.access_token);

          $.when(sendToken).done(function (data) {
            localStorage.setItem('token', data.key);
            window.location = '/account/profile';
          }).fail(function (data) {
            api.errorAction(this, data);
          });
        },
        function (e) {
          // TODO: notificate user about reason of error;
          app.routers.navigate(
            '/account/login', {trigger: true, replace: true}
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
                        api.errorAction(self, data);
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
                        api.errorAction(self, data);
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
        'submit .signup-form': api.submitAction,
        'click .btn-google': 'loginGoogle',
        'click .btn-linkedin': 'loginLinkedin',
        'click .btn-facebook': 'loginFacebook'
    },

    initialize(options) {
        this.register_fields = options.register_fields;
        this.hello = require('hellojs');
        this.socialAuth = require('js/views/social-auth.js');
    },

    render() {
        this.model.urlRoot = serverUrl + Urls['rest_register']();
        let template = require('./templates/signup.pug');
        this.$el.html(
            template({
                register_fields: this.register_fields,
            })
        );
        return this;
    },

    _success(data) {
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

    loginGoogle() {

        var self = this;

        self.hello('google').login({
            scope: 'profile,email'}).then(
            function (e) {
                var sendToken = self.socialAuth.sendToken('google', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {

                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                }).fail(function (data) {
                    api.errorAction(self, data);
                });
            },
            function (e) {
                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login', {trigger: true, replace: true}
                );
            });
    },
    loginFacebook() {

        var self = this;

        self.hello('facebook').login({
            scope: 'public_profile,email'}).then(
            function (e) {
                var sendToken = self.socialAuth.sendToken('facebook', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {
                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                }).fail(function (data) {
                    api.errorAction(self, data);
                });
            },
            function (e) {

                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login', {trigger: true, replace: true}
                );
            });

    },
    loginLinkedin() {

        var self = this;

        self.hello('linkedin').login({
            scope: 'r_basicprofile,r_emailaddress',}).then(
            function (e) {
                var sendToken = self.socialAuth.sendToken('linkedin', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {
                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                }).fail(function (data) {
                    api.errorAction(self, data);
                });
            },
            function (e) {

                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login', {trigger: true, replace: true}
                );
            });

    }
  }),

  reset: Backbone.View.extend({
    events: {
      'submit form': 'submit',
    },

    render(){
      let template = require('./templates/reset.pug');
      this.$el.html(template({}));
      return this;
    },

    submit(e) {
      e.preventDefault();

      let email = $(e.currentTarget).find('#email').val();
      api.makeRequest(Urls.rest_password_reset(), {
        email: email,
        type: 'POST',
      }).then((data) => {
        $('#content').html(
          '<section class="reset"><div class="container"><div class="col-lg-12"><h2 class="dosis text-uppercase text-sm-center text-xs-center m-t-85">' + data.success + '</h2></div></div></section>'
        );
      });
    }

  }),
};
