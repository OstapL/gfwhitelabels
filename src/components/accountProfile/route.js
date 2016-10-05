module.exports = Backbone.Router.extend({
  routes: {
    'account/profile': 'accountProfile',
    'account/logout': 'logout',
    'account/change-password': 'changePassword',
    'reset/password/confirm/': 'setNewPassword',
    // 'account/new-password': 'setNewPassword',
    'dashboard/issue-dashboard': 'issueDashboard',
  },

  accountProfile() {
    if(!app.user.is_anonymous()) {
      require.ensure([], function() {
        const View = require('components/accountProfile/views.js');

        api.makeCacheRequest(Urls.rest_user_details(), 'OPTIONS')
          .then((response) => {
            var i = new View.profile({
              el: '#content',
              model: app.user.toJSON(),
              fields: response.actions.PUT
            });
            i.render();
            app.hideLoading();
        });
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
      let model = new userModel({id: app.user.pk});
      let i = new View.changePassword({
        el: '#content',
        model: model,
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
