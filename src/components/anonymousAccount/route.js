const View = require('./views.js');

module.exports = Backbone.Router.extend({
  routes: {
    'account/login': 'login',
    'account/signup': 'signup',
    'account/facebook/login/': 'loginFacebook',
    'account/google/login/': 'loginGoogle',
    'account/linkedin/login/': 'loginLinkedin',
    'account/finish/login/': 'finishSocialLogin',
    'account/reset': 'resetForm',
    'reset-password/code/:code': 'resetPassword',
    'code/:code': 'membershipConfirmation',
  },

  login(id) {
    require.ensure([], function() {
      let a1 = api.makeRequest(authServer + '/rest-auth/login', 'OPTIONS');
      $.when(a1).done((metaData) => {
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
    require.ensure([], function() {
      const a1 = api.makeRequest(authServer + '/rest-auth/registration', 'OPTIONS');

      $.when(a1).done((metaData) => {
        const signView = new View.signup({
          el: '#content',
          fields: metaData.fields,
          model: {}
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
      require.ensure([], function() {
          const socialAuth = require('./social-auth.js');
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
          const socialAuth = require('./social-auth.js');
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

          const socialAuth = require('./social-auth.js');
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
          const socialAuth = require('./social-auth.js');
          const hello = require('hellojs');
      });
  },

  resetForm: function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    $('#content').scrollTo();

    const i = new View.reset();
    i.render();
    app.hideLoading();

  },

  resetPassword: function(code) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    $('#content').scrollTo();
    api.makeRequest(authServer + '/reset-password/code', 'PUT', {
      'reset_password_code': code,
    }).done((data) => {
      localStorage.setItem('token', data.key);
      window.location = '/account/password/new';
    }).fail((data) => {
      $('#content').html(
        '<section class="reset"><div class="container"><div class="col-lg-12"><h2 class="dosis text-uppercase text-sm-center text-xs-center m-t-85"> Your code have been expired. Please request new link </h2></div></div></section>'
      );
      app.hideLoading();
    });
  },


  membershipConfirmation(code) {
    api.makeRequest(formcServer + '/invitation/' + code, 'GET').done((response) => {

      const data = {
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
    });
  },

});    
