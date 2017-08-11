const templateMap = {
  'custom-element-design': 'custom_element_design',
  'custom-element-newsleter': 'custom_newsleter',
};

module.exports = {
  routes: {
    'demo/:name': 'pageDemo',
  },
  methods: {
    pageDemo: function (name) {
      require.ensure([], (require) => {
        const template = require('./templates/' + (templateMap[name] || name) + '.pug');
        $('#content').html(template());
        $('body').scrollTo();
        app.hideLoading();
      }, 'pg_chunk');
    },
  },
};