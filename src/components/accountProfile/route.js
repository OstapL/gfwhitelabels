module.exports = Backbone.Router.extend({
  routes: {
    'account/profile': 'accountProfile',
    'account/logout': 'logout',
    'account/change-password': 'changePassword',
    'reset/password/confirm/': 'setNewPassword',
    // 'account/new-password': 'setNewPassword',
    'dashboard/issue-dashboard': 'issueDashboard',
  },

  execute: function (callback, args, name) {
    if (app.user.is_anonymous() && name !== 'logout') {
      const pView = require('components/anonymousAccount/views.js');
      require.ensure([], function() {
        new pView.popupLogin().render(window.location.pathname);
        app.hideLoading();
        $('#sign_up').modal();
      });
      return false;
    }
    if (callback) callback.apply(this, args);
  },  

  accountProfile() {
    if(!app.user.is_anonymous()) {
      require.ensure([], function() {
        const View = require('components/accountProfile/views.js');

        const fieldsR = app.makeCacheRequest(authServer + '/rest-auth/data', 'OPTIONS');
        const dataR = app.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(fieldsR, dataR).done((fields, data) => {
          const i = new View.profile({
            el: '#content',
            model: data[0],
            fields: fields[0].fields
          });
          i.render();
          app.hideLoading();
        })
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  logout(id) {
    // ToDo
    // Do we really want have to wait till user will be ready ?
    app.user.logout();
  },

  changePassword: function() {
    require.ensure([], function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.changePassword({
        el: '#content',
        model: {},
      });
      i.render();
      app.hideLoading();
    });
  },

  setNewPassword: function() {
    require.ensure([], function() {
      const View = require('components/accountProfile/views.js');
      let model = new userModel({id: app.user.pk});
      model.baseUrl = '/api/password/reset';
      let i = new View.setNewPassword({
        el: '#content',
        model: model,
      });
      i.render();
      app.hideLoading();
    });
  },

  issueDashboard: function() {
    require.ensure([], function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.issueDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
    });
  },
});    
