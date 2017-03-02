const View = require('./views.js');

module.exports = {
  routes: {
    'account/login': 'login',
    'account/signup': 'signup',
    'account/facebook/login/': 'loginFacebook',
    'account/google/login/': 'loginGoogle',
    'account/linkedin/login/': 'loginLinkedin',
    'account/finish/login/': 'finishSocialLogin',
    'account/reset': 'resetForm',
    'reset-password/code/:code': 'resetPassword',
    'code/:formcId/:code': 'membershipConfirmation',
  },
  methods: {
    login(id) {
      require.ensure([], function () {
        let optionsR = api.makeRequest(authServer + '/rest-auth/login', 'OPTIONS');
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
      require.ensure([], function () {
        const optionsR = api.makeRequest(authServer + '/rest-auth/registration', 'OPTIONS');
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

    loginFacebook() {
      require.ensure([], () => {
        const socialAuth = require('./social-auth.js');
        const hello = require('hellojs');

        hello('facebook').login({
          scope: 'public_profile,email',
        }).then(e => {
          let sendTokenR = socialAuth.sendToken('facebook', e.authResponse.access_token);
          $.when(sendTokenR).done((data) => {
            localStorage.setItem('token', data.key);
            window.location = '/account/profile';
          });
        }, (e) => {
          // TODO: notificate user about reason of error;
          app.routers.navigate('/account/login', {trigger: true, replace: true});
        });
      });

    },

    loginLinkedin() {

      require.ensure([], () => {
        const socialAuth = require('./social-auth.js');
        const hello = require('hellojs');

        hello('linkedin').login({
          scope: 'r_basicprofile,r_emailaddress',
        }).then((e) => {
            let sendTokenR = socialAuth.sendToken('linkedin', e.authResponse.access_token);
            $.when(sendTokenR).done(function (data) {
              localStorage.setItem('token', data.key);
              window.location = '/account/profile';
            });
          }, (e) => {
            // TODO: notificate user about reason of error;
            app.routers.navigate('/account/login', {trigger: true, replace: true});
          }
        );
      });
    },

    loginGoogle() {
      require.ensure([], () => {
        const socialAuth = require('./social-auth.js');
        const hello = require('hellojs');

        hello('google').login({
          scope: 'profile,email',
        }).then((e) => {
          let sendTokenR = socialAuth.sendToken('google', e.authResponse.access_token);
          $.when(sendTokenR).done((data) => {
            localStorage.setItem('token', data.key);
            window.location = '/account/profile';
          });
        }, (e) => {
          // TODO: notificate user about reason of error;
          app.routers.navigate('/account/login', {trigger: true, replace: true});
        });
      });
    },

    finishSocialLogin() {
      require.ensure([], function () {
        const socialAuth = require('./social-auth.js');
        const hello = require('hellojs');
      });
    },

    resetForm() {
      //TODO: app.user.passwordChanged?
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      $('#content').scrollTo();
      const i = new View.reset();
      i.render();
      app.hideLoading();
    },

    resetPassword(code) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      $('#content').scrollTo();
      api.makeRequest(authServer + '/reset-password/code', 'PUT', {
        reset_password_code: code,
        domain: window.location.host,
      }).done((data) => {
        localStorage.setItem('token', data.key);
        window.location = '/account/password/new';
      }).fail((data) => {
        const template = require('./templates/expiredCode.pug');
        $('#content').html(template());
        app.hideLoading();
      });
    },

    membershipConfirmation(formcId, code) {
      if (localStorage.getItem('token') !== null) {
        localStorage.removeItem('token', '');
        localStorage.removeItem('user');
        setInterval(() => window.location.reload(), 300);
        return false;
      }

      const invitationUrl = formcServer + '/' + formcId + '/team-members/invitation/' + code;
      api.makeRequest(invitationUrl, 'GET').done((response) => {
        const data = {
          id: formcId,
          company_name: response.company_name,
          title: response.title,
          code: code,
        };

        const View = require('components/anonymousAccount/views.js');
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
    },
  },
};

