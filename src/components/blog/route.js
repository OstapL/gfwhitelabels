const View = require('components/blog/views.js');

module.exports = Backbone.Router.extend({
  routes: {
      'blog': 'list',
      'blog/:id': 'detail',
      'blog/create': 'createEdit',
      'blog/:id/edit': 'createEdit',
    },

  execute: function (callback, args, name) {
      if (app.user.is_anonymous() && name == 'createEdit') {
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

  list() {
      api.makeCacheRequest(blogServer + '/blog', 'GET').
        then((data) => {
          new View.list({
            model: data
          }).render();
          app.hideLoading();
        });
  },

  createEdit (id) {
      let r = '';
      if(id) {
            r = blogServer + '/' + id;
          }
      $.when(r).
        then((data) => {
        new View.createEdit({
          model: data
        }).render();
        app.hideLoading();
      });
  },

  detail(id) {
      api.makeCacheRequest(blogServer + '/blog/' + id, 'GET').
        then((data) => {
          new View.detail({
            model: data
          }).render();
          app.hideLoading();
        });
  },
	   
});
