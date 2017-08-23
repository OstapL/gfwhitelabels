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

    blogDetail(id) {
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
