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
    api.makeCacheRequest(blogServer + '/').
      then((data) => {
        const i = View.list({
          model: data
        });
      });
  },

  createEdit (id) {
    let r = '';
    if(id) {
      r = blogServer + '/' + id;
    }
    $.when(r).
      then((data) => {
        const i = View.list({
          model: data
        }).render();
      });
  },

  detail(id) {
    api.makeCacheRequest(blogServer + '/' + id).
      then((data) => {
        const i = View.list({
          model: data
        });
      });
  },
   
});
