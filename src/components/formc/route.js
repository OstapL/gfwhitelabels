module.exports = Backbone.Router.extend({
  routes: {
    'formc/introduction/:id': 'introduction',
    'formc/team-members/:id/add/:type/:index': 'teamMemberAdd',
    'formc/team-members/:id': 'teamMembers',
    'formc/related-parties/:id': 'relatedParties',
    'formc/use-of-proceeds/:id': 'useOfProceeds',
    'formc/risk-factors/:id/market': 'riskFactorsMarket',
    'formc/risk-factors/:id': 'riskFactors',

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
        id: 1,
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
        id: 1,
        members:[{"bio":"I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart","first_name":"Arthur","last_name":"Yip","title":"CEO","photo":"https://s3.amazonaws.com/growthfountain-development/filer_public/c1/02/c102632a-b9d3-4ce3-b6ff-25758553e82d/3001585_121246046_2.jpg?v=60730","growup":"Brooklyn","linkedin":"https://arthuryip.xyz","state":"AR","college":"Memorial University of Newfoundland","facebook":"https://arthuryip.xyz","type":"member","email":"arthuryip723@gmail.com"},{"bio":"","first_name":"asdg","last_name":"","title":"","photo":"","growup":"","linkedin":"","state":"","college":"","facebook":"","type":"advisor","email":""}],
        // members:[],
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
      model: new Backbone.Model({
        id: 1,
      }),
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

  relatedParties(id) {
    const View = require('components/formc/views.js');
    const i = new View.relatedParties({
      el: '#content',
      model: new Backbone.Model({
        id: 1,
        had_transactions: 'yes'
      }),
      fields: {
        transactions: {},
      },

    });
    i.render();
    app.hideLoading();
  },

  useOfProceeds(id) {
    const View = require('components/formc/views.js');
    const i = new View.useOfProceeds({
      el: '#content',
      model: new Backbone.Model({
        id: 1,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },
  riskFactors(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactors({
      el: '#content',
      model: new Backbone.Model({
        id: 1,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },
  riskFactorsMarket(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsMarket({
      el: '#content',
      model: new Backbone.Model({
        id: 1,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },
});