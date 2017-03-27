
//TODO: ?????
const socialAuth = require('./social-auth.js');

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
    login(id) {
      require.ensure([], () => {
        const View = require('./views.js');
        let optionsR = api.makeRequest(app.config.authServer + '/rest-auth/login', 'OPTIONS');
        $('body').scrollTo();
        $.when(optionsR).done((metaData) => {
          let loginView = new View.login({
            el: '#content',
            fields: metaData.fields,
            model: {},
          });
          loginView.render();
          app.hideLoading();
        }).fail((xhr, error) => {
          // ToDo
          // Show global error message
          console.log(xhr, error);
          app.hideLoading();
        });
      });
    },

    signup() {
      require.ensure([], () => {
        const View = require('./views.js');
        const optionsR = api.makeRequest(app.config.authServer + '/rest-auth/registration', 'OPTIONS');
        $('body').scrollTo();
        $.when(optionsR).done((metaData) => {
          const signView = new View.signup({
            el: '#content',
            fields: metaData.fields,
            model: {},
          });
          signView.render();
          app.hideLoading();
        }).fail((xhr, error) => {
          // ToDo
          // Show global error message
          console.log(xhr, error);
          app.hideLoading();
        });
      });
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
        const i = new View.reset();
        i.render();
        app.hideLoading();
      });
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
        const template = require('./templates/expiredCode.pug');
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

          const i = new View.membershipConfirmation(_.extend({
            el: '#content',
          }, data));
          i.render();
          app.hideLoading();
        }).fail((response) => {
          const template = require('./templates/expiredCode.pug');
          $('#content').html(template());
          app.hideLoading();
        });
      });
    },
  },
};
