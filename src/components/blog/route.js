module.exports = {
  routes: {
    'blog': 'list',
    'blog/:id': 'detail',
    'blog/create': 'createEdit',
    'blog/:id/edit': 'createEdit',
  },
  methods: {
    list() {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        api.makeCacheRequest(app.config.blogServer + '/', 'GET').then((data) => {
          new View.list({
            model: data,
          }).render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },

    createEdit(id) {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        const r = id ? app.config.blogServer + '/' + id : '';
        $.when(r).then((data) => {
          new View.createEdit({
            model: data,
          }).render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },

    detail(id) {
      require.ensure([], () => {
        const View = require('components/blog/views.js');
        api.makeCacheRequest(app.config.blogServer + '/' + id, 'GET').then((data) => {
          new View.detail({
            model: data,
          }).render();
          app.hideLoading();
        });
      }, 'blog_chunk');
    },
  },
  auth: ['createEdit'],
};
