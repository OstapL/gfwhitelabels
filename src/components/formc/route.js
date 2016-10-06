module.exports = Backbone.Router.extend({
  routes: {
    'formc/introduction': 'introduction',
    'formc/team-members/:id/add/:type/:index': 'teamMemberAdd',
    'formc/team-members/:id': 'teamMembers',

  },
  introduction() {

    const View = require('components/formc/views.js');
    var i = new View.introduction({
      el: '#content',
      // fields: meta[0].actions.POST,
      // model: new Model.model(model[0][0] || {}),
      fields: {
        failed_to_comply: {
          label: "Failed to Comply",
          required: false,
          type: 'radio',
          validate: function(name, attrs, formData) {

          },
        },
        cc_number: {
          label: "Credit Card",
          required: true,
          type: 'string',
        }
      },
      model: new Backbone.Model({
        // failed_to_comply: 'It was the best of times.',
        failed_to_comply: '',
      }),
    });
    app.hideLoading();
    i.render();
  },
  
  teamMembers(id) {
    const View = require('components/formc/views.js');
    // var i = new View.memberDirector({
    var i = new View.teamMembers({
      el: '#content',
      fields: {},
      model: new Backbone.Model({
        members:[],
      }),
    });
    i.render();
    app.hideLoading();
    $('#content').scrollTo();
  },

  teamMemberAdd(id, type, index) {
    const View = require('components/formc/views.js');

    const addForm = new View.teamMemberAdd({
      el: '#content',
      model: new Backbone.Model({}),
      type: type,
      index: index,
      fields: {
        previous_positions: {},
        experiences: {},
      },
    });
    addForm.render();
    app.hideLoading();
  },
});