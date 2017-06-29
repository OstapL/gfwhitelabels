const socialAuth = require('./social-auth.js');

module.exports = {
  popupLogin: Backbone.View.extend({
    urlRoot: app.config.authServer + '/rest-auth/login',
    template: require('./templates/popupLogin.pug'),
    events: {
      'submit #sign-in-form': 'signinSubmit',
      'click #sign-in-form .reset-password-link': 'resetPassword',

      'submit #sign-up-form': 'signupSubmit',
      'click #sign-up-form .btn-social-network': 'loginWithSocial',

      'click .link-show-login': 'switchToLogin',
      'click .link-show-sign-up': 'switchToSignup',
    },

    initialize(options) {
      this.fields = {
        checkbox1: {
          type: 'boolean',
          validate: {
            OneOf: {
              choices: [true, '1'],
              labels: [],
            },
            choices: {},
          },
          required: true,
          messageRequired: 'You must agree to the terms before creating an account',
        },
      };
    },

    render() {
      // clear previous modal elements from DOM
      $('#sign_in').remove();
      $('#sign_up').remove();

      $('body').scrollTo();

      this.$el.html(
        this.template()
      );

      $('body').append(this.$el);

      this.$signIn = $('#sign_in');
      this.$signUp = $('#sign_up');

      this.$signIn.off('hidden.bs.modal');
      this.$signUp.off('hidden.bs.modal');
      this.$signIn.off('shown.bs.modal');
      this.$signUp.off('shown.bs.modal');

      this.$signIn.on('hidden.bs.modal', () => {
        if (this.showModal) {
          this.$signUp.modal('show');
          this.showModal = false;
        }
      });

      this.$signUp.on('hidden.bs.modal', () => {
        if (this.showModal) {
          this.$signIn.modal('show');
          this.showModal = false;
        }
      });

      this.$signUp.modal('show');

      return this;
    },

    switchToLogin(e) {
      e.preventDefault();
      this.showModal = true;
      this.$signUp.modal('hide');
      return false;
    },

    switchToSignup(e) {
      e.preventDefault();
      this.showModal = true;
      this.$signIn.modal('hide');
      return false;
    },

    _success(data) {
      if (this.urlRoot.indexOf('registration') >= 0)
        app.emitFacebookPixelEvent('CompleteRegistration');

      app.user.setData(data);

      this.$signIn.modal('hide');
      this.$signUp.modal('hide');
    },

    loginWithSocial(e) {
      socialAuth.loginWithSocialNetwork.call(this, e);
    },

    signupSubmit(e) {
      this.urlRoot = `${app.config.authServer}/rest-auth/registration`;
      let data = $(e.target).closest('form').serializeJSON({ useIntKeysAsArrayIndex: true });
      api.submitAction.call(this, e, data);
    },

    signinSubmit(e) {
      this.urlRoot = `${app.config.authServer}/rest-auth/login`;
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
    },
  }),

  login: Backbone.View.extend({
    urlRoot: app.config.authServer + '/rest-auth/login',
    template: require('./templates/login.pug'),
    events: {
      'submit .login-form': api.submitAction,
    },

    initialize(options) {
      this.fields = {
        email: {
          required: true,
          type: 'email',
        },
        password: {
          required: true,
          type: 'password',
          minLength: 8,
          //needed for validation message
          label: 'Password',
        }
      };
    },

    render() {
      $('body').scrollTo();

      this.$el.html(
        this.template()
      );
      return this;
    },

    _success(data) {
      app.user.setData(data);
    },

  }),

  signup: Backbone.View.extend({
    urlRoot: `${app.config.authServer}/rest-auth/registration`,
    template: require('./templates/signup.pug'),
    events: {
      'submit .signup-form': api.submitAction,
      'click .btn-social-network': 'loginWithSocial',
    },

    initialize(options) {
      this.fields = {
        first_name: {
          type: 'string',
          validate: {
            _Length: 'Length',
          },
          required: true,
        },
        last_name: {
          type: 'string',
          validate: {
            _Length: 'Length',
          },
          required: true,
        },
        email: {
          type: 'email',
          validate: {
            _Email: 'Email',
            _Length: 'Length',
          },
          required: true
        },
        domain: {
          type: 'string',
          validate: {
            _Length: 'Length',
          },
          required: true,
        },
        checkbox1: {
          type: 'boolean',
          validate: {
            _OneOf: 'OneOf'
          },
          required: true,
          messageRequired: 'You must agree to the terms before creating an account',
        },
        password1: {
          type: 'string',
          'validate': {
            _Length: 'Length',
          },
          required: true,
        },
        password2: {
          type: 'string',
          validate: {
            _Length: 'Length'
          },
          required: true,
        },
      };
    },

    render() {
      this.$el.html(
        this.template({})
      );
      return this;
    },

    _success(data) {
      app.emitFacebookPixelEvent('CompleteRegistration');
      app.user.setData(data);
    },

    loginWithSocial(e) {
      socialAuth.loginWithSocialNetwork.call(this, e);
    }

  }),

  reset: Backbone.View.extend({
    urlRoot: app.config.authServer + '/reset-password/send',
    el: '#content',
    template: require('./templates/reset.pug'),
    events: {
      'submit form': api.submitAction,
    },

    render() {
      this.fields = {};
      this.fields.email = {
        type: 'email',
        required: true,
      };
      this.fields.domain = {
        type: 'text',
        required: true,
      };
      this.el.innerHTML = this.template();
      return this;
    },

    _success(data) {
      app.emitFacebookPixelEvent('CompleteRegistration');

      app.hideLoading();
      $('body').scrollTo();
      $('#content').html(
        '<section class="reset">' +
          '<div class="container">' +
            '<div class="col-lg-12">' +
              '<h2 class="text-uppercase text-sm-center text-xs-center m-t-85 m-b-2">' +
                'reset password' +
              '</h2>' +
              '<h3 class="font-weight-light m-t-0 text-xs-center"> Don\'t worry, you\'ll be up and running in seconds!</h3>' +
              '<h2 class="text-xs-center m-b-1 font-weight-light m-t-3"> ' +
                '<div class="icon-in-circle align-middle">' +
                  '<i class="fa fa-paper-plane-o" aria-hidden="true"></i>' +
                '</div>' +
                'Email sent successfully' +
              '</h2>' +
              '<h3 class="font-weight-light m-t-2 m-b-0 text-xs-center">We sent you an email with instructions on how to reset your password</h3>' +
            '</div>' +
          '</div>' +
        '</section>'
      );
    },
  }),

  membershipConfirmation: Backbone.View.extend({
    urlRoot: app.config.formcServer + '/:id/team-members/invitation',

    template: require('./templates/confirmation.pug'),

    events: {
      'click .btn-confirm': 'confirmMembership',
      'click .btn-cancel': 'cancelMembership',
    },

    initialize(options) {
      this.code = options.code;
      this.title = options.title;
      this.company_name = options.company_name;
      this.id = options.id;
    },

    render() {
      this.urlRoot = this.urlRoot.replace(':id', this.id);
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
      return '/';
    },

    confirmMembership(e) {
      e.preventDefault();

      api.makeRequest(
        this.urlRoot,
        'PUT',
        {
          activation_code: this.code,
          domain: window.location.host,
        }
      ).then((data) => {
        app.user.token = data['token'];
        localStorage.setItem('token', data['token']);
        api.makeRequest(
          app.config.authServer + '/info',
          'GET'
        ).then((data) => {
          app.user.setData(data);
        });
      }).fail((xhr, status, text) => {
        api.errorAction(this, xhr, status, text, this.fields);
      });

      return false;
    },

    cancelMembership(e) {
      e.preventDefault();

      $('body').scrollTo();
      app.routers.navigate('account/profile', { trigger: true, replace: false });

      return false;
    },
  }),

};
