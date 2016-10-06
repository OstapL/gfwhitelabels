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

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/introduction', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/introduction');

    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.introduction({
        el: '#content',
        fields: fields[0].fields, 
        model: data[0], 
      });
      app.hideLoading();
      i.render();
    })
  },
  
  teamMembers(id) {
    const View = require('components/formc/views.js');
    // var i = new View.memberDirector({
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/team-members', 'GET');

    $.when(dataR).done((data) => {
      data[0].id = id;
      const i = new View.teamMembers({
        el: '#content',
        fields: {},
        model: data
      });
      i.render();
      app.hideLoading();
      $('#content').scrollTo();
    });
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

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/related-parties', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/related-parties');

    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.relatedParties({
        el: '#content',
        fields: fields[0].fields,
        model: data[0],
      });
      i.render();
      app.hideLoading();
    })
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
      return;

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds');

    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.useOfProceeds({
        el: '#content',
        model: data[0],
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    });
  },

  riskFactorsInstruction(id) {
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
          "id": id,
          "previously_sold_securities": "XXX",
          "financials_for_prior_fiscal_year": 500,
          "sold_securities_data": [
            {'taxable_income': 111, 'total_income': 222, 'total_tax': 333, "total_assets": 100, "long_term_debt": 500, "short_term_debt": 400, "cost_of_goods_sold": 700, "account_receivable": 300, "cash_and_equivalents": 200, "revenues_sales": 600},
            {'taxable_income': 11, 'total_income': 22, 'total_tax': 33, "total_assets": 10, "long_term_debt": 50, "short_term_debt": 40, "cost_of_goods_sold": 70, "account_receivable": 30, "cash_and_equivalents": 20, "revenues_sales": 60}
          ],
          "financials_for_most_recent_fiscal_year": 100,
        },
        // fields: fields[0].fields,
        fields: {sold_securities_data: {schema: {total_assets: {type: 'integer', required: true},
          cash_and_equivalents: {type: 'integer', required: true},
          account_receivable: {type: 'integer', required: true},
          short_term_debt: {type: 'integer', required: true},
          long_term_debt: {type: 'integer', required: true},
          revenues_sales: {type: 'integer', required: true},
          cost_of_goods_sold: {type: 'integer', required: true},
          total_income: {type: 'integer', required: true},
          taxable_income: {type: 'integer', required: true},
          total_tax: {type: 'integer', required: true},}
        }},
      });
      i.render();
      app.hideLoading();
      return;

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/financial-condition', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/financial-condition');

    $.when(fieldsR, dataR).done((fields, data) => {
      const i = new View.financialCondition({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    });

  },

  outstandingSecurity(id) {
    const View = require('components/formc/views.js');
      const i = new View.outstandingSecurity({
        el: '#content',
        model: {
          id: id,
        },
        // fields: {
        //   loans: {},
        //   exempt_offering: {},
        //   business_loans_or_debt: {},
        // },
        fields:
          {"terms_modified": {"type": "string", "required": true}, "principal_shareholders_affect": {"type": "string", "required": true}, "business_loans_or_debt": {"schema": {"maturity_date": {"type": "integer", "required": true}, "other_material_terms": {"type": "integer", "required": true}, "creditor": {"type": "string", "required": true}, "outstaind_amount": {"type": "integer", "required": true}, "interest_rate": {"type": "integer", "required": true}}, "type": "nested", "required": false}, "risks_to_purchasers": {"type": "string", "required": true}, "exempt_offering": {"schema": {"exemption_relied_upon": {"type": "integer", "required": true}, "use_of_proceeds": {"type": "integer", "required": true}, "offering_date": {"type": "date", "required": true}, "amount_sold": {"type": "integer", "required": true}, "securities_offered": {"type": "integer", "required": true}}, "type": "nested", "required": false}, "outstanding_securities_choice": {"type": "boolean", "required": true}, "security_differences": {"type": "string", "required": true}, "rights_of_securities_beign": {"type": "string", "required": true}, "outstanding_securities": {"schema": {"voting_right": {"type": "integer", "required": true}, "security_type": {"type": "string", "required": true}, "amount_outstanding": {"type": "integer", "required": true}, "amount_authroized": {"type": "integer", "required": true}, "other_rights": {"type": "integer", "required": true}}, "type": "nested", "required": false}},
      });
      i.render();
      app.hideLoading();
      return;

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security');

    $.when(fieldsR, dataR).done((fields, data) => {
      const i = new View.outstandingSecurity({
        el: '#content',
        model: data[0],
        fields: fields[0].fields 
      });
      i.render();
      app.hideLoading();
    });
  },

  backgroundCheck(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/background-check', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/background-check');

    $.when(fieldsR, dataR).done((fields, data) => {
      console.log(fields);
      const i = new View.backgroundCheck({
        el: '#content',
        model: data,
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    });
  },

});
