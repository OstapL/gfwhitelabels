const View = require('components/formc/views.js');
const formcHelpers = require('./helpers.js');

function getOCCF(optionsR, viewName, params = {}) {
  $('#content').scrollTo();
  params.el = '#content';
  $.when(optionsR, app.user.getCompanyR(), app.user.getCampaignR(), app.user.getFormcR())
    .done((options, company, campaign, formc) => {

      if(options != '') {
        params.fields = options[0].fields;
      }
      // ToDo
      // This how we can avoid empty response
      if(company == '') {
        params.company = app.user.company;
        params.campaign = app.user.campaign;
        params.formc = app.user.formc;
      }
      else {
        if(Object.keys(company[0]).length > 0) {
          params.company = app.user.company = app.user.company || company[0];
          params.campaign = app.user.campaign = app.user.campaign || campaign[0];
          params.formc = app.user.formc = app.user.formc || formc[0];
        } else {
          params.company = {};
          params.campaign = {};
          params.formc = {};
        }
      }

      if(params.company.is_approved != 5) {
        alert('Sorry, your campaign is not approved yet. Please wait till we check your campaign');
        app.routers.navigate('/campaign/' + params.campaign.id +  '/general_information', { trigger: true, replace: true } );
        return false;
      }

      if(params.formc.is_paid == false && viewName != 'introduction') {
        app.routers.navigate('/formc/' + params.formc.id +  '/introduction?notPaid=1', { trigger: true, replace: true } );
        return false;
      }

      if(typeof viewName == 'string') {
        new View[viewName](Object.assign({}, params)).render();
        app.hideLoading();
      } else {
        viewName();
      }

      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
    }).fail(function(xhr, response, error) {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
      else {
        api.errorAction.call(this, $('#content'), xhr, response, error);
      }
    });
};


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
    'formc/:id/formc-elecrtonic-signature-financial-certification': 'electronicSignatureFinancials',
  },

  execute: function (callback, args, name) {
    //ga('send', 'pageview', "/" + Backbone.history.getPath());
    if (!app.user.ensureLoggedIn(window.location.pathname))
      return false;

    if (callback)
      callback.apply(this, args);
    else
      alert('Not such url');
  },

  introduction(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/introduction', 'OPTIONS');
    getOCCF(optionsR, 'introduction', {});
  },
  
  teamMembers(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/employers', 'OPTIONS');
    getOCCF(optionsR, 'teamMembers', {});
  },

  teamMemberAdd(id, role, user_id) {

    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/' + role, 'OPTIONS');
    getOCCF(optionsR, 'teamMemberAdd', {
      role: role,
      user_id: user_id
    });

  },

  relatedParties(id) {

    const optionsR = api.makeCacheRequest(
      formcServer + '/' + id + '/related-parties',
      'OPTIONS'
    );
    getOCCF(optionsR, 'relatedParties', {});

  },

  useOfProceeds(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
    getOCCF(optionsR, 'useOfProceeds', {});
  },

  riskFactorsInstruction(id) {
    getOCCF('', 'riskFactorsInstruction', {});
  },

  riskFactorsMarket(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMarket', {});
  },

  riskFactorsFinancial(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-financial', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsFinancial', {});
  },

  riskFactorsOperational(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-operational', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsOperational', {});
  },

  riskFactorsCompetitive(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-competitive', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsCompetitive', {});
  },

  riskFactorsPersonnel(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-personnel', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsPersonnel', {});
  },

  riskFactorsLegal(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-legal', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsLegal', {});
  },

  riskFactorsMisc(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-misc', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMisc', {});
  },

  financialCondition(id) {
    const optionsR = api.makeRequest(
      formcServer + '/' + id + '/financial-condition', 
      'OPTIONS'
    );
    getOCCF(optionsR, 'financialCondition', {});
  },

  outstandingSecurity(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security', 'OPTIONS');
    getOCCF(optionsR, 'outstandingSecurity', {});
  },

  backgroundCheck(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/background-check', 'OPTIONS');
    getOCCF(optionsR, 'backgroundCheck', {});
  },

  finalReview(id) {

    let companyFieldsR = api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    let campaignFieldsR = api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS');
    let formcFieldsR = api.makeCacheRequest(formcServer + '/' + id, 'OPTIONS');

    $('#content').scrollTo();
    $.when(
      companyFieldsR,
      campaignFieldsR,
      formcFieldsR,
      app.user.getCompanyR(),
      app.user.getCampaignR(),
      app.user.getFormcR(id),
    ).done((companyFields, campaignFields, formcFields, company, campaign, formc) => {
    
      app.user.company = company[0];
      app.user.campaign = campaign[0];
      app.user.formc = formc[0];

      const fields = {
        company: companyFields[0].fields,
        campaign: campaignFields[0].fields,
        formc: formcFields[0].fields,
      };
      const finalReviewView = new View.finalReview({
        el: '#content',
        fields: fields,
        formcId: id,
      });
      finalReviewView.render();
      app.hideLoading();

    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  finalReviewTwo: function(id) {

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
      let i = new View.electronicSignature({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureCompany(id) {
      let i = new View.electronicSignatureCompany({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureCik(id) {
      let i = new View.electronicSignatureCik({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureFinancials(id) {
      let i = new View.electronicSignatureFinancials({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
});
