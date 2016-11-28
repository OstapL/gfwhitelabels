module.exports = Backbone.Router.extend({
  routes: {
    'formc/:id/introduction': 'introduction',
    'formc/:id/team-members/:type/:index': 'teamMemberAdd',
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
    'formc/:id/final-review': 'finalReview',
    'formc/:id/final-review-two': 'finalReviewTwo',
    'formc/:id/formc-elecrtonic-signature': 'electronicSignature',
    'formc/:id/formc-elecrtonic-signature-company': 'electronicSignatureCompany',
    'formc/:id/formc-elecrtonic-signature-cik': 'electronicSignatureCik',
  },

  execute: function (callback, args, name) {
    if (app.user.is_anonymous()) {
      const pView = require('components/anonymousAccount/views.js');
      require.ensure([], function() {
        new pView.popupLogin().render(window.location.pathname);
        app.hideLoading();
        $('#sign_up').modal();
      });
      return false;
    }
    if (callback) callback.apply(this, args);
    else alert('Not such url');
  },

  introduction(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/introduction', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/introduction');


    $('#content').scrollTo();
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
    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/team-members', 'GET');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.teamMembers({
        el: '#content',
        fields: fields[0].fields,
        model: data[0],
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  teamMemberAdd(id, role, user_id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/' + role, 'OPTIONS');

    let dataR = null;
    if(user_id != 'new') {
      dataR = api.makeCacheRequest(formcServer + '/' + id + '/team-members', 'GET');
    }

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      if(data) {
        data = data[0].team_members.filter(function(el) { return el.user_id == user_id})[0]
        data.formc_id = id;
      } else {
        data = {formc_id: id};
      }
      const addForm = new View.teamMemberAdd({
        el: '#content',
        model: data,
        role: role,
        user_id: user_id,
        fields: fields[0].fields,
      });
      addForm.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  relatedParties(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(
      formcServer + '/' + id + '/related-parties',
      'OPTIONS'
    );
    let dataR = api.makeCacheRequest(
      formcServer + '/' + id + '/related-parties'
    );

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.relatedParties({
        fields: fields[0].fields,
        model: data[0],
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  useOfProceeds(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds');
    let campaignR = api.makeCacheRequest(authServer + '/user/campaign');

    $('#content').scrollTo();
    $.when(fieldsR, dataR, campaignR).done((fields, data, campaign) => {
      data[0].id = id;
      const i = new View.useOfProceeds({
        el: '#content',
        model: data[0],
        campaign: campaign[0],
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsInstruction(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsMarket({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsMarket(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsMarket({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsFinancial(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-financial', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-financial');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsFinancial({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsOperational(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-operational', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-operational');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsOperational({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsCompetitive(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-competitive', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-competitive');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsCompetitive({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsPersonnel(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-personnel', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-personnel');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsPersonnel({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsLegal(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-legal', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-legal');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsLegal({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  riskFactorsMisc(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-misc', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-misc');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.riskFactorsMisc({
        el: '#content',
        model: data[0], 
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  financialCondition(id) {
    const View = require('components/formc/views.js');
    const fieldsR = api.makeRequest(
      formcServer + '/' + id + '/financial-condition', 
      'OPTIONS'
    );
    const dataR = api.makeRequest(
      formcServer + '/' + id + '/financial-condition'
    );
    const campaignR = api.makeCacheRequest(authServer + '/user/campaign');

    $('#content').scrollTo();
    $.when(fieldsR, dataR, campaignR).done((fields, data, campaign) => {
      data[0].id = id;
      const i = new View.financialCondition({
        el: '#content',
        fields: fields[0].fields,
        model: data[0],
        campaign: campaign[0],
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  outstandingSecurity(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.outstandingSecurity({
        el: '#content',
        model: data[0],
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  backgroundCheck(id) {
    const View = require('components/formc/views.js');

    let fieldsR = api.makeCacheRequest(formcServer + '/' + id + '/background-check', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/background-check');

    $('#content').scrollTo();
    $.when(fieldsR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.backgroundCheck({
        el: '#content',
        model: data[0],
        fields: fields[0].fields,
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  finalReview(id) {
    const View = require('components/formc/views.js');

    let companyR = api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    let campaignR = api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS');
    let formcR = api.makeCacheRequest(formcServer + '/' + id + '/final-review', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/final-review');

    $('#content').scrollTo();
    $.when(companyR, campaignR, formcR, dataR).done((company, campaign, formc, data) => {
      data[0].id = id;
      const fields = {
        company: company[0].fields,
        campaign: campaign[0].fields,
        formc: formc[0].fields,
      };
      const i = new View.finalReview({
        el: '#content',
        model: data[0],
        fields: fields
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  finalReviewTwo: function(id) {
    const View = require('components/formc/views.js');

    let companyR = api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    let campaignR = api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS');
    let formcR = api.makeCacheRequest(formcServer + '/' + id + '/final-review', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/final-review');

    $('#content').scrollTo();
    $.when(companyR, campaignR, formcR, dataR).done((company, campaign, formc, data) => {
      data[0].id = id;
      const fields = {
        company: company[0].fields,
        campaign: campaign[0].fields,
        formc: formc[0].fields,
      };
      const i = new View.finalReviewTwo({
        el: '#content',
        model: data[0],
        fields: fields
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },
  electronicSignature(id) {
      const View = require('components/formc/views.js');
      let i = new View.electronicSignature({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureCompany(id) {
      const View = require('components/formc/views.js');
      let i = new View.electronicSignatureCompany({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
    electronicSignatureCik(id) {
      const View = require('components/formc/views.js');
      let i = new View.electronicSignatureCik({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
});
