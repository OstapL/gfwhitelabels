//TODO: move this into methods for webpack optimization
const View = require('components/blog/views.js');

module.exports = {
  routes: {
    'blog': 'list',
    'blog/:id': 'detail',
    'blog/create': 'createEdit',
    'blog/:id/edit': 'createEdit',
  },
  methods: {
    list() {
      api.makeCacheRequest(app.config.blogServer + '/', 'GET').then((data) => {
        new View.list({
          model: data,
        }).render();
        app.hideLoading();
      });
    },

    createEdit(id) {
      const r = id ? app.config.blogServer + '/' + id : '';
      $.when(r).then((data) => {
        new View.createEdit({
          model: data,
        }).render();
        app.hideLoading();
      });
    },

    detail(id) {
      api.makeCacheRequest(app.config.blogServer + '/' + id, 'GET').then((data) => {
        new View.detail({
          model: data,
        }).render();
        app.hideLoading();
      });
    },
  },
  auth: ['createEdit'],
};
