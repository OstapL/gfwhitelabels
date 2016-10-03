module.exports = Backbone.Router.extend({
  routes: {
    'formc/:id/introduction': 'introduction',
    'formc/:id/team-members/add/:type/:index': 'teamMemberAdd',
    'formc/:id/team-members': 'teamMembers',
    'formc/:id/related-parties': 'relatedParties',
    'formc/:id/use-of-proceeds': 'useOfProceeds',
    'formc/:id/risk-factors-market': 'riskFactorsMarket',
    'formc/:id/risk-factors-financial': 'riskFactorsFinancial',
    'formc/:id/risk-factors-operational': 'riskFactorsOperational',
    'formc/:id/risk-factors-competitive': 'riskFactorsCompetitive',
    'formc/:id/risk-factors-personnel': 'riskFactorsPersonnel',
    'formc/:id/risk-factors-legal': 'riskFactorsLegal',
    'formc/:id/risk-factors-misc': 'riskFactorsMisc',
    'formc/:id/risk-factors-instruction': 'riskFactorsInstruction',
    'formc/:id/financial-condition': 'financialCondition',
    'formc/:id/outstanding-security': 'outstandingSecurity',
    'formc/:id/background-check': 'backgroundCheck',
  },

  introduction(id) {
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
          // try min length here.
          validate: function(name, attrs, formData) {
            if (formData.failed_to_comply == '') return true;
            if (formData.failed_to_comply.length < 100) return false;
            return true;
          },
          // minLength: 100,
        },
        certify: {
          required: true,
          type: 'checkbox',
          label: 'Certifing Statement'
        },
        // cc_number: {
        //   label: "Credit Card",
        //   required: true,
        //   type: 'string',
        // }
      },
      model: {
        // failed_to_comply: 'It was the best of times.',
        id: id,
        failed_to_comply: '',
      },
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
      model: {
        id: id,
        members:[
          {"bio":"I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart","first_name":"Arthur","last_name":"Yip","title":"CEO","photo":"https://s3.amazonaws.com/growthfountain-development/filer_public/c1/02/c102632a-b9d3-4ce3-b6ff-25758553e82d/3001585_121246046_2.jpg?v=60730","growup":"Brooklyn","linkedin":"https://arthuryip.xyz","state":"AR","college":"Memorial University of Newfoundland","facebook":"https://arthuryip.xyz","type":"director","email":"arthuryip723@gmail.com"},
          {"bio":"","first_name":"asdg","last_name":"","title":"","photo":"","growup":"","linkedin":"","state":"","college":"","facebook":"","type":"officer","email":""},
          {"bio":"I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart","first_name":"Arthur","last_name":"Yip","title":"CEO","photo":"https://s3.amazonaws.com/growthfountain-development/filer_public/c1/02/c102632a-b9d3-4ce3-b6ff-25758553e82d/3001585_121246046_2.jpg?v=60730","growup":"Brooklyn","linkedin":"https://arthuryip.xyz","state":"AR","college":"Memorial University of Newfoundland","facebook":"https://arthuryip.xyz","type":"holder","email":"arthuryip723@gmail.com"},
        ],
        officers: {
          ceo: {first_name: 'ken', last_name: 'staut'},
          financial: {first_name: 'hillary', last_name: 'clinton'},
          // controller: {first_name: 'donald', last_name: 'trump'},
        },
        // members:[],
      },
    });
    i.render();
    app.hideLoading();
    $('#content').scrollTo();
  },

  teamMemberAdd(id, type, index) {
    const View = require('components/formc/views.js');

    const addForm = new View.teamMemberAdd({
      el: '#content',
      model: {
        id: id,
      },
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
      model: {
        id: id,
        had_transactions: 'yes'
      },
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
      model: {
        id: id,
      },
      fields: {
        'offering-expense': {type: 'row'},
      },

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsInstruction(id) {
    // debugger
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsInstruction({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsMarket(id) {
    // debugger
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsMarket({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsFinancial(id) {
    // debugger
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsFinancial({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsOperational(id) {
    // debugger
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsOperational({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsCompetitive(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsCompetitive({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsPersonnel(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsPersonnel({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsLegal(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsLegal({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsMisc(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsMisc({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  financialCondition(id) {
    const View = require('components/formc/views.js');
    const i = new View.financialCondition({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  outstandingSecurity(id) {
    const View = require('components/formc/views.js');
    const i = new View.outstandingSecurity({
      el: '#content',
      model: {
        id: id,
      },
      fields: {
        loans: {},
        exempt_offerings: {},
      },

    });
    i.render();
    app.hideLoading();
  },

  backgroundCheck(id) {
    const View = require('components/formc/views.js');
    const i = new View.backgroundCheck({
      el: '#content',
      model: {
        id: id,
      },
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

});