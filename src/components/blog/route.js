module.exports = {
  routes: {
    'blog': 'blogList',
    'blog/:id': 'blogDetail',
    'blog/create': 'createEdit',
    'blog/:id/edit': 'createEdit',
  },
  methods: {
    blogList() {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        api.makeCacheRequest(app.config.blogServer + '/', 'GET').then((data) => {
          app.currentView = new View.list({
            model: data,
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },

    createEdit(id) {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        const r = id ? app.config.blogServer + '/' + id : '';
        $.when(r).then((data) => {
          app.currentView = new View.createEdit({
            model: data,
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },

    blogDetail(id) {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        api.makeCacheRequest(app.config.blogServer + '/' + id, 'GET').then((data) => {
          app.currentView = new View.detail({
            model: data,
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },
  },
  auth: ['createEdit'],
};
