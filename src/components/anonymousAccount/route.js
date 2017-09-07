// const socialAuth = require('./social-auth.js');

module.exports = {
  routes: {
    'account/login': 'login',
    'account/signup': 'signup',
    'account/facebook/login/': 'loginFacebook',
    'account/google/login/': 'loginGoogle',
    'account/linkedin/login/': 'loginLinkedin',
    'account/reset': 'resetForm',
    'reset-password/code/:code': 'resetPassword',
    'code/:formcId/:code': 'membershipConfirmation',
  },
  methods: {
    login() {
      require.ensure([], (require) => {
        $('body').scrollTo();

        let paramsToken = app.getParams().token;
        if(app.getParams().token) {
          localStorage.setItem('token', paramsToken);
          let data = {
            'token': paramsToken
          };
          app.user.setData(data, '/account/profile');
          return false;
        }

        const View = require('./views.js');
        app.currentView = new View.login({
          el: '#content',
          model: {},
        });

        app.currentView.render();
        app.hideLoading();

      }, 'anonymous_account_chunk');
    },

    signup() {
      require.ensure([], (require) => {
        $('body').scrollTo();

        const View = require('./views.js');
        app.currentView = new View.signup({
          el: '#content',
          model: {},
        });
        app.currentView.render();
        app.hideLoading();
      }, 'anonymous_account_chunk');
    },

    // //TODO: ??????
    // loginFacebook() {
    //   socialAuth.login('facebook').done((data) => {
    //     app.user.setData(data);
    //   });
    // },
    //
    // loginLinkedin() {
    //   socialAuth.login('linkedin').done((data) => {
    //     app.user.setData(data);
    //   });
    // },
    //
    // loginGoogle() {
    //   socialAuth.login('google').done((data) => {
    //     app.user.setData(data);
    //   });
    // },

    resetForm() {
      require.ensure([], () => {
        const View = require('./views.js');

        //TODO: app.user.passwordChanged?
        app.user.emptyLocalStorage();
        $('body').scrollTo();
        app.currentView = new View.reset();
        app.currentView.render();
        app.hideLoading();
      }, 'anonymous_account_chunk');
    },

    //TODO: ????????
    resetPassword(code) {
      app.user.emptyLocalStorage();
      $('body').scrollTo();
      api.makeRequest(app.config.authServer + '/reset-password/code', 'PUT', {
        reset_password_code: code,
        domain: window.location.host,
      }).done((data) => {
        app.user.setData(data,  '/account/password/new');
      }).fail((data) => {
        // const template = require('./templates/expiredCode.pug');
        app.hideLoading();
      });
    },

    membershipConfirmation(formcId, code) {
      require.ensure([], () => {
        const View = require('./views.js');

        //TODO: potential candidate for app.user.passwordChanged
        if (localStorage.getItem('token') !== null) {
          app.user.emptyLocalStorage();
          setInterval(() => window.location.reload(), 300);
          return false;
        }

        const invitationUrl = app.config.formcServer + '/' + formcId + '/team-members/invitation/' + code;
        api.makeRequest(invitationUrl, 'GET').done((response) => {
          const data = {
            id: formcId,
            company_name: response.company_name,
            title: response.title,
            code: code,
          };

          app.currentView = new View.membershipConfirmation(Object.assign({
            el: '#content',
          }, data));
          app.currentView.render();
          app.hideLoading();
        }).fail((response) => {
          const template = require('./templates/expiredCode.pug');
          $('#content').html(template());
          app.hideLoading();
        });
      }, 'anonymous_account_chunk');
    },
  },
};
