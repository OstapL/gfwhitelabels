const validation = require('components/validation/validation.js');

module.exports = {
  // TODO
  // To do refactoring
  popupLogin: Backbone.View.extend({
    urlRoot: Urls.rest_login(),
    events: {
      'submit .login-form': 'loginSubmit',
      'submit .signup-form': 'signupSubmit',
      'click .btn-google': 'loginGoogle',
      'click .btn-linkedin': 'loginLinkedin',
      'click .btn-facebook': 'loginFacebook',
    },

    _success(data) {
      if(data.hasOwnProperty('key')) {
        localStorage.setItem('token', data.key);
        setTimeout(() => {
          window.location = this.next ? this.next : '/account/profile';
        }, 200);
      } else {
        alert('Server return no authentication data');
      }
    },

    loginSubmit(e) {
      this.urlRoot = Urls.rest_login();
      api.submitAction.call(this, e); 
    },

    signupSubmit(e) {
      this.urlRoot = Urls.rest_register();
      api.submitAction.call(this, e); 
    },

    loginGoogle() {
      this.hello('google').login({scope: 'profile,email'}).
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

      this.hello('linkedin').login({
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
    },

    render(next) {
      const template = require('./templates/popupLogin.pug');
      this.next = next;
      this.$el.html(
        template()
      );
      $('body').append(this.$el);
      return this;
    },
  }),

  login: Backbone.View.extend({
    urlRoot: Urls.rest_login(),
    events: {
      'submit .login-form': api.submitAction,
      'click .btn-google': 'loginGoogle',
      'click .btn-linkedin': 'loginLinkedin',
      'click .btn-facebook': 'loginFacebook',
    },

    initialize(options) {
      this.fields = options.fields;
      this.hello = require('hellojs');
      this.socialAuth = require('./social-auth.js');
    },

    render() {
      this.model.urlRoot = serverUrl + Urls['rest_login']();
      let template = require('./templates/login.pug');
      this.$el.html(
        template({
          fields: this.fields,
        })
      );
      return this;
    },

    _success(data) {
      if(data.hasOwnProperty('key')) {
        localStorage.setItem('token', data.key);
        setTimeout(function() {
          window.location = app.getParams().next ? app.getParams().next : 
                '/account/profile';
        }, 200);
      } else {
        validation.invalidMsg(form, '', 'Server return no authentication data');
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
    urlRoot: Urls.rest_register(),
    events: {
        'submit .signup-form': api.submitAction,
        'click .btn-google': 'loginGoogle',
        'click .btn-linkedin': 'loginLinkedin',
        'click .btn-facebook': 'loginFacebook'
    },

    initialize(options) {
        this.fields = options.fields;
        this.fields.checkbox1.messageRequired = 'You must agree to the terms ' +
          'before creating an account';
        this.hello = require('hellojs');
        this.socialAuth = require('./social-auth.js');
    },

    render() {
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
            localStorage.removeItem('user');
            localStorage.setItem('token', data.key);

            delete this.model.password1;
            delete this.model.password2;
            delete this.model.key;

            window.location = app.getParams().next ? app.getParams().next : '/account/profile';
        } else {
            validation.invalidMsg(                                 
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
