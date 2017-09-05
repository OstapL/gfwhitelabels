const socialAuth = require('./social-auth.js');
const { createFields } = require('fields/new-fields.js');

const LOGIN_FIELDS = {
  email: {
    type: 'email',
    required: true
  },
  password: {
    type: 'password',
    required: true,
    minLength: 8,
    //needed for validation message
    label: 'Password',
  },
  domain: {
    type: 'string',
    required: true,
  },
  checkbox1: {
    type: 'boolean',
    required: true,
    messageRequired: 'You must agree to the terms before creating an account',
  },
};

const SIGNUP_FIELDS = {
  first_name: {
    type: 'string',
    required: true,
    minLength: 2,
    label: 'First Name',
  },
  last_name: {
    type: 'string',
    required: true,
    minLength: 2,
    label: 'Last Name',
  },
  checkbox1: {
    type: 'boolean',
    required: true,
    messageRequired: 'You must agree to the terms before creating an account',
  },
  email: LOGIN_FIELDS.email,
  domain: LOGIN_FIELDS.domain,
  password1: Object.assign({}, LOGIN_FIELDS.password, { label: 'Password' }),
  //we left only one password field
  // password2: Object.assign({}, LOGIN_FIELDS.password, { label: 'Re-enter Password'}),
};

const popupAuthHelper = {
  events: {
    'submit form': api.submitAction,
    'click .reset-password-link': 'resetPassword',
    'click .switchAuthPopup': 'switchPopupView',
  },

  methods: {
    renderModal(selector, switchToView) {
      $('body').scrollTo();

      this.$el.html(this.template({
        fields: this.fields,
      }));

      $(selector).remove();

      $('body').append(this.$el);

      this.initModal(selector, switchToView);

      return this;
    },

    resetPassword(e) {
      e.preventDefault();
      this.reset = true;
      this.$modal.modal('hide');
      return false;
    },

    switchPopupView(e) {
      e.preventDefault();
      this.showModal = true;
      this.$modal.modal('hide');
      return false;
    },

    initModal(selector, switchToView) {
      this.$modal = $(selector);
      this.$modal.off('hidden.bs.modal');
      this.$modal.on('hidden.bs.modal', () => {
        this.destroy();
        if (this.showModal) {
          this.showModal = false;
          (new switchToView()).render();
        } else if (this.reset) {
          this.reset = false;
          setTimeout(() => {
            window.location = '/account/reset';
          }, 100);
        }
      });

      this.$modal.modal({
        backdrop: 'static',
      });
    },

    destroy() {
      this.$modal.off('hidden.bs.modal');
      this.$modal.remove();
      this.undelegateEvents();
      this.$el.remove();
    },
  },

};

const onRegistrationComplete = (data) => {
  // WHY ??
  // для чего тут этот if?
  if (typeof(data) !== 'object')
    return;

  // WHY ??
  // Почему просто не перенести этот код в events.RegiatrsionComplete?
  // мы же там собираем events и наш лог это тоже событие
  // зачем это отдельно выносить?
  const analyticsData = Object.assign({
    referrer: document.referrer,
  }, data);

  app.analytics.emitEvent(app.analytics.events.RegistrationCompleted, analyticsData);

  api.makeRequest(app.config.authServer + '/log', 'POST', {
    path: document.referrer,
    device: navigator.userAgent
  });
};

function signUpWithSocialNetwork(e) {
  e.preventDefault();
  const network = $(e.target).closest('.btn-social-network').data('network');

  socialAuth.signupWithSocialNetwork.call(this, network).then((data) => {
    if (data === false)
      return;

    app.user.setData(data).then(() => {
      onRegistrationComplete(app.user.stats);
    });
  });
};

function logInWithSocialNetwork(e) {
  e.preventDefault();
  const network = $(e.target).closest('.btn-social-network').data('network');

  socialAuth.loginWithSocialNetwork.call(this, network).then((data) => {
    if (data === false)
      return;

    app.user.setData(data);
  });
};

const Views = {
  popupLogin: Backbone.View.extend(Object.assign({
    urlRoot: app.config.authServer + '/rest-auth/login',
    template: require('./templates/popupLogin.pug'),
    events: Object.assign({
      'click .btn-social-network': 'loginWithSocial',
    }, popupAuthHelper.events),

    initialize() {
      this.fields = LOGIN_FIELDS;
    },

    render() {
      return this.renderModal('#sign_in', Views.popupSignup);
    },

    _success(data) {
      app.user.setData(data);
      this.$modal.modal('hide');
    },

    loginWithSocial(e) {
      e.preventDefault();
      const network = $(e.target).closest('.btn-social-network').data('network');

      socialAuth.loginWithSocialNetwork.call(this, network).then((data) => {
        if (data === false)
          return;

        app.user.setData(data);
      });
    },

  },
    popupAuthHelper.methods
  )),

  popupSignup: Backbone.View.extend(Object.assign({
    urlRoot: `${app.config.authServer}/rest-auth/registration`,
    template: require('./templates/popupSignup.pug'),

    events: Object.assign({
      'click .btn-social-network': 'signUpWithSocial',
    }, popupAuthHelper.events),

    initialize() {
      this.fields = SIGNUP_FIELDS;
    },

    render() {
      return this.renderModal('#sign_up', Views.popupLogin);
    },

    _success(data) {
      app.user.setData(data).then(() => {
        onRegistrationComplete(app.user.stats);
      });

      this.$modal.modal('hide');
    },

    signUpWithSocial(e) {
      signUpWithSocialNetwork.call(this, e);
    },
  },
    popupAuthHelper.methods
  )),

  login: Backbone.View.extend({
    urlRoot: app.config.authServer + '/rest-auth/login',
    template: require('./templates/login.pug'),
    events: {
      'submit .login-form': api.submitAction,
      'click .btn-social-network': 'loginWithSocial',
    },

    initialize() {
      this.fieldsSchema = LOGIN_FIELDS;

      this.fieldsAttr = {
        email: {
          placeholder: 'E-mail',
          autocomplete: 'off',
          inputContainerClass: 'form-group row clearfix',
        },
        password: {
          placeholder: 'Password',
          autocomplete: 'off',
          inputContainerClass: 'form-group row clearfix',
        },
      };

      this.fields = createFields(this.fieldsSchema, this.fieldsAttr);

      this.listenToNavigate();
    },

    render() {
      $('body').scrollTo();

      this.$el.html(
        this.template({
          fields: this.fields,
        })
      );

      Object.keys(this.fields).forEach((name) => this.fields[name].postRender());

      return this;
    },

    loginWithSocial(e) {
      logInWithSocialNetwork.call(this, e);
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
      'click .btn-social-network': 'signUpWithSocial',
    },

    initialize() {
      //this fields left for backward compatibility;
      this.fieldsSchema = SIGNUP_FIELDS;

      this.fieldsAttr = {
        first_name: {
          placeholder: 'First Name',
          inputContainerClass: 'form-group row clearfix',
        },
        last_name: {
          placeholder: 'Last Name',
          inputContainerClass: 'form-group row clearfix',
        },
        email: {
          placeholder: 'E-mail',
          inputContainerClass: 'form-group row clearfix',
        },
        password1: {
          placeholder: 'Password',
          inputContainerClass: 'form-group row clearfix',
        },
      };

      this.fields = createFields(this.fieldsSchema, this.fieldsAttr);
      
      this.listenToNavigate();
    },

    render() {
      this.$el.html(
        this.template({
          fields: this.fields,
        })
      );

      Object.keys(this.fields).forEach((name) => this.fields[name].postRender());

      return this;
    },

    _success(data) {
      app.user.setData(data).then(() => {
        onRegistrationComplete(app.user.stats);
      });
    },

    signUpWithSocial(e) {
      signUpWithSocialNetwork.call(this, e);
    },
  }),

  reset: Backbone.View.extend({
    urlRoot: app.config.authServer + '/reset-password/send',
    el: '#content',
    template: require('./templates/reset.pug'),
    events: {
      'submit form': api.submitAction,
    },

    initialize() {
      this.fieldsSchema = app.utils.pick(SIGNUP_FIELDS, ['email', 'domain']);
      this.fieldsAttr = {
        email: {
          id: 'email',
          placeholder: 'E-mail',
          inputContainerClass: 'form-group row clearfix',
          inputClass: 'form-control',
        },
      };

      this.fields = createFields(this.fieldsSchema, this.fieldsAttr);

      this.listenToNavigate();
    },

    render() {
      this.el.innerHTML = this.template({
        fields: this.fields,
      });

      Object.keys(this.fields).forEach((name) => this.fields[name].postRender());

      return this;
    },

    _success(data) {
      app.analytics.emitEvent(app.analytics.events.RegistrationCompleted, app.user.stats);

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
      this.urlRoot = this.urlRoot.replace(':id', this.id);

      this.listenToNavigate();
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

module.exports = Views;
