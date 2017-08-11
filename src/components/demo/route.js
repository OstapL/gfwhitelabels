const templateMap = {
  'custom-element-design': 'custom_element_design',
  'custom-element-newsleter': 'custom_newsleter',
  'google-analytics': 'google_analytics',
  'admin-dashboard': 'admin_dashboard',
  'storage': 'storage'
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