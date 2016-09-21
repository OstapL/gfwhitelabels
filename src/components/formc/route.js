module.exports = Backbone.Router.extend({
  routes: {
    'formc/introduction': 'introduction',
  },
  introduction() {
    // debugger
    const View = require('components/formc/views.js');
    var i = new View.introduction({
      el: '#content',
      // fields: meta[0].actions.POST,
      // model: new Model.model(model[0][0] || {}),
      fields: {
        failed_to_comply: {
          label: "Failed to Comply",
          required: false,
          type: 'radio'
        },
        cc_number: {
          label: "Credit Card",
          required: true,
          type: 'string',
        }
      },
      model: {
        failed_to_comply: 'It was the best of times.',
      },
    });
    app.hideLoading();
    i.render();
  },
});