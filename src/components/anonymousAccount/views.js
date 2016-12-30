const validation = require('components/validation/validation.js');

const auth = {
  social: require('./social-auth.js'),
};

module.exports = {
  // TODO
  // To do refactoring

  // popupLogin1: Backbone.View.extend({
  //   urlRoot: authServer + '/rest-auth/login',
  //   template : require('./templates/popupLogin.pug'),
  //   events: {
  //     'click .link-show-sign-in': 'switchToSignIn',
  //     'click .link-show-sign-up': 'switchToSignUp',
  //
  //     'submit .login-form': 'login',
  //     'submit .signup-form': 'signupSubmit',
  //     'click .btn-google': 'loginGoogle',
  //     'click .btn-linkedin': 'loginLinkedin',
  //     'click .btn-facebook': 'loginFacebook',
  //
  //     //modal events
  //     'hide.bs.modal #sign_in': '',
  //     'hidden.bs.modal #sign_in': '',
  //     'hide.bs.modal #sign_up': '',
  //     'hidden.bs.modal #sign_up': '',
  //   },
  //
  //   initialize(options) {
  //     this.onSucces = options.onSucces;
  //     this.successUrl = options.successUrl;
  //   },
  //
  //   _success(data) {
  //     if(data.hasOwnProperty('key')) {
  //       localStorage.setItem('token', data.key);
  //       setTimeout(() => {
  //         window.location = this.next ? this.next : '/account/profile';
  //       }, 200);
  //     } else {
  //       alert('Server return no authentication data');
  //     }
  //   },
  //
  //
  //   closeModal(e) {
  //
  //   },
  //
  //   switchToSignIn(e) {
  //
  //   },
  //
  //   switchToSignUp(e) {
  //     $('#sign_in').modal('hide');
  //     $('#sign_up').modal();
  //   },
  //
  //   login(e) {
  //     let $form = $(e.target).closest('form');
  //     let data = $form.serializeJSON({ useIntKeysAsArrayIndex: true });
  //
  //   },
  //
  //   loginGoogle() {
  //     this.hello('google').login({scope: 'profile,email'}).
  //     then((e) => {
  //         var sendToken = this.socialAuth.sendToken('google', e.authResponse.access_token);
  //
  //         $.when(sendToken).done(function (data) {
  //           localStorage.setItem('token', data.key);
  //           window.location = '/account/profile';
  //         }).fail(function (data) {
  //           api.errorAction(this, data);
  //         });
  //       },
  //       function (e) {
  //         // TODO: notificate user about reason of error;
  //         app.routers.navigate(
  //           '/account/login', {trigger: true, replace: true}
  //         );
  //       });
  //   },
  //
  //   loginFacebook: function() {
  //
  //     var self = this;
  //
  //     self.hello('facebook').login({
  //       scope: 'public_profile,email'}).then(
  //       function (e) {
  //         var sendToken = self.socialAuth.sendToken('facebook', e.authResponse.access_token);
  //
  //         $.when(sendToken).done(function (data) {
  //           localStorage.setItem('token', data.key);
  //           window.location = '/account/profile';
  //         }).fail(function (data) {
  //           api.errorAction(self, data);
  //         });
  //       },
  //       function (e) {
  //
  //         // TODO: notificate user about reason of error;
  //         app.routers.navigate(
  //           '/account/login',
  //           {trigger: true, replace: true}
  //         );
  //       });
  //   },
  //
  //   loginLinkedin: function() {
  //
  //     this.hello('linkedin').login({
  //       scope: 'r_basicprofile,r_emailaddress',}).then(
  //       function (e) {
  //         var sendToken = self.socialAuth.sendToken('linkedin', e.authResponse.access_token);
  //
  //         $.when(sendToken).done(function (data) {
  //           localStorage.setItem('token', data.key);
  //           window.location = '/account/profile';
  //         }).fail(function (data) {
  //           api.errorAction(self, data);
  //         });
  //       },
  //       function (e) {
  //
  //         // TODO: notificate user about reason of error;
  //         app.routers.navigate(
  //           '/account/login',
  //           {trigger: true, replace: true}
  //         );
  //       });
  //   },
  //
  //   render() {
  //     this.$el.html(
  //       this.template()
  //     );
  //
  //     $('body').append(this.$el);
  //
  //     setTimeout(() => {
  //       this._initModal();
  //     }, 100);
  //
  //     return this;
  //   },
  //
  //   _initModal() {
  //     this.$signUp = $('#sign_up');
  //     this.$signIn = $('#sign_in');
  //
  //     this.$signIn.on('');
  //     this.$signUp.on('');
  //
  //     $('#sign_up').modal();
  //   },
  //
  // }),

  popupLogin: Backbone.View.extend({
    urlRoot: authServer + '/rest-auth/login',
    template: require('./templates/popupLogin.pug'),
    events: {
      'click #sign-in-form .btn-login': 'signinSubmit',
      'click #sign-in-form .reset-password-link': 'resetPassword',

      'submit #sign-up-form': 'signupSubmit',
      'click #sign-up-form .btn-social-network': 'loginWithSocialNetwork',

      'click .link-show-login': 'switchToLogin',
      'click .link-show-sign-up': 'switchToSignup',
    },

    initialize(options) {
      this.fields = {
        checkbox1: {
          type: 'boolean',
          validate:{
            OneOf: {
              choices:[ true,"1" ],
              labels:[]
            },
            choices:{}
          },
          required: true,
          messageRequired: "You must agree to the terms before creating an account"
        }
      };
      this.next = options.next || window.location.pathname;
    },

    render() {
      $('#content').scrollTo();
      this.$el.html(
        this.template()
      );

      $('body').append(this.$el);

      this.$signIn = $('#sign_in');
      this.$signUp = $('#sign_up');

      this.$signIn.modal('show');

      return this;
    },

    _ensureAgreedWithRules() {
      let data = {};
      let cb = this.el.querySelector('#agree-rules');

      if (cb.checked)
        data.checkbox1 = cb.value;

      if (!validation.validate({checkbox1: this.fields.checkbox1}, data, this)) {
        _(validation.errors).each((errors, key) => {
          validation.invalidMsg(this, key, errors);
        });

        return false;
      }

      return true;
    },

    switchToLogin(e) {
      e.preventDefault();

      this.$signUp.modal('hide');
      this.$signIn.modal();

      return false;
    },

    switchToSignup(e) {
      e.preventDefault();

      this.$signIn.modal('hide');
      this.$signUp.modal();

      return false;
    },

    _success(data) {

      this.$signIn.modal('hide');
      this.$signUp.modal('hide');

      if(data.hasOwnProperty('key')) {
        localStorage.setItem('token', data.key);
        setTimeout(() => {
          window.location = this.next || '/account/profile';
        }, 200);
      } else {
        alert('Server return no authentication data');
      }
    },

    loginWithSocialNetwork(e) {
      e.preventDefault();

      if (!this._ensureAgreedWithRules())
        return false;

      const network = $(e.target).data('network');

      app.showLoading();
      auth.social.login(network).then((cancelled) => {
        if (cancelled) {
          app.hideLoading();
          return;
        }

        $('#sign_up').modal('hide');
        $('#sign_in').modal('hide');

        app.hideLoading();

        setTimeout(() => {
          window.location = '/account/profile';
        }, 100);

      }).catch((err) => {
        app.hideLoading();
        api.errorAction(this, err);
      });

      return false;
    },

    signupSubmit(e) {
      console.log('signup submit');
      this.urlRoot = authServer + '/rest-auth/registration';
      let data = $(e.target).closest('form').serializeJSON({ useIntKeysAsArrayIndex: true });
      api.submitAction.call(this, e, data);
    },

    signinSubmit(e) {
      console.log('signin submit');
      let data = $(e.target).closest('form').serializeJSON({ useIntKeysAsArrayIndex: true });
      data.checkbox1 = 1;
      api.submitAction.call(this, e, data);
    },

    resetPassword(e) {
      e.preventDefault();

      setTimeout(() => {
        window.location = '/account/reset';
      }, 100);

      this.$signIn.modal('hide');

      return false;
    }
  }),

  login: Backbone.View.extend({
    urlRoot: authServer + '/rest-auth/login',
    template: require('./templates/login.pug'),
    events: {
      'submit .login-form': api.submitAction,
    },

    initialize(options) {
      this.fields = options.fields;
    },

    render() {
      $('#content').scrollTo();

      this.$el.html(
        this.template({
          fields: this.fields,
        })
      );
      return this;
    },

    _success(data) {
      if(data.hasOwnProperty('key')) {
        localStorage.setItem('token', data.key);
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(function() {
          window.location = app.getParams().next ? app.getParams().next : 
                '/account/profile';
        }, 200);
      } else {
        validation.invalidMsg(form, '', 'Server return no authentication data');
      }
    },

  }),

  signup: Backbone.View.extend({
    urlRoot: `${authServer}/rest-auth/registration`,
    template: require('./templates/signup.pug'),
    events: {
      'submit .signup-form': api.submitAction,
      'click .btn-social-network': 'loginWithSocialNetwork',
      'click .btn-google': 'loginGoogle',
      'click .btn-linkedin': 'loginLinkedin',
      'click .btn-facebook': 'loginFacebook',
    },

    initialize(options) {
      this.fields = options.fields;
      this.fields.checkbox1.messageRequired = 'You must agree to the terms ' +
        'before creating an account';
    },

    render() {
      this.$el.html(
        this.template({
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

    _ensureAgreedWithRules() {
      let data = {};
      let cb = this.el.querySelector('#agree-rules');

      if (cb.checked)
        data.checkbox1 = cb.value;

      if (!validation.validate({checkbox1: this.fields.checkbox1}, data, this)) {
        _(validation.errors).each((errors, key) => {
          validation.invalidMsg(this, key, errors);
        });

        return false;
      }

      return true;
    },

    loginWithSocialNetwork(e) {
      e.preventDefault();

      if (!this._ensureAgreedWithRules())
        return false;

      const network = $(e.target).data('network');

      app.showLoading();
      auth.social.login(network).then((cancelled) => {
        if (cancelled) {
          app.hideLoading();
          return;
        }

        $('#sign_up').modal('hide');
        $('#sign_in').modal('hide');

        app.hideLoading();

        setTimeout(() => {
          window.location = '/account/profile';
        }, 100);

      }).catch((err) => {
        app.hideLoading();
        api.errorAction(this, err);
      });

      return false;
    },

  }),

  reset: Backbone.View.extend({
    urlRoot: authServer + '/reset-password/send',
    el: '#content',
    template: require('./templates/reset.pug'),
    events: {
      'submit form': api.submitAction,
    },

    render() {
      this.fields = {};
      this.fields.email = {
        type: 'email',
        required: true
      };
      this.fields.domain = {
        type: 'text',
        required: true
      };
      this.el.innerHTML = this.template();
      return this;
    },

    _success(data) {
      app.hideLoading();
      $('body').scrollTo();
      $('#content').html(
        '<section class="reset"><div class="container"><div class="col-lg-12"><h2 class="dosis text-uppercase text-sm-center text-xs-center m-t-85"> Please check your email for instructions. </h2></div></div></section>'
      );
    }

  }),

  membershipConfirmation: Backbone.View.extend({
    urlRoot: formcServer + '/invitation',

    template: require('./templates/confirmation.pug'),

    events: {
      'click .btn-confirm': 'confirmMembership',
      'click .btn-cancel': 'cancelMembership',
    },

    initialize(options) {
      this.code = options.code;
      this.title = options.title;
      this.company_name = options.company_name;
    },

    render() {
      this.$el.html(
        this.template({
          title: this.title,
          company_name: this.company_name,
          code: this.code,
        })
      );

      return this;
    },

    getSuccessUrl() {
      return '/account/profile';
    },

    confirmMembership(e) {
      e.preventDefault();

      api.makeRequest(
          this.urlRoot,
          'PUT',
          {
            'activation_code': this.code,
          }
      ).then((data) => {
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          window.location = this.next ? this.next : '/account/profile';
        }, 200);
      }).fail((xhr, status, text) => {
        api.errorAction(this, xhr, status, text, this.fields);
      });

      return false;
    },

    cancelMembership(e) {
      e.preventDefault();

      $('#content').scrollTo();
      app.routers.navigate(
        'account/profile',
        { trigger: true, replace: false }
      );

      return false;
    },
  }),

};
