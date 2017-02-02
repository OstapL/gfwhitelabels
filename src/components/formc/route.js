const View = require('components/formc/views.js');
const formcHelpers = require('./helpers.js');

function getOCCF(optionsR, viewName, params = {}) {
  $('#content').scrollTo();
  params.el = '#content';
  $.when(optionsR, app.user.getCompanyR(), app.user.getCampaignR(), app.user.getFormcR(params.id))
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
    getOCCF(optionsR, 'introduction', {id: id});
  },
  
  teamMembers(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/employers', 'OPTIONS');
    getOCCF(optionsR, 'teamMembers', {id: id});
  },

  teamMemberAdd(id, role, user_id) {

    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/' + role, 'OPTIONS');
    getOCCF(optionsR, 'teamMemberAdd', {
      role: role,
      user_id: user_id,
      id: id
    });

  },

  relatedParties(id) {

    const optionsR = api.makeCacheRequest(
      formcServer + '/' + id + '/related-parties',
      'OPTIONS'
    );
    getOCCF(optionsR, 'relatedParties', {'id': id});

  },

  useOfProceeds(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
    getOCCF(optionsR, 'useOfProceeds', {'id': id});
  },

  riskFactorsInstruction(id) {
    getOCCF('', 'riskFactorsInstruction', {'id': id});
  },

  riskFactorsMarket(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMarket', {'id': id});
  },

  riskFactorsFinancial(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-financial', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsFinancial', {'id': id});
  },

  riskFactorsOperational(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-operational', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsOperational', {'id': id});
  },

  riskFactorsCompetitive(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-competitive', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsCompetitive', {'id': id});
  },

  riskFactorsPersonnel(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-personnel', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsPersonnel', {'id': id});
  },

  riskFactorsLegal(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-legal', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsLegal', {'id': id});
  },

  riskFactorsMisc(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-misc', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMisc', {'id': id});
  },

  financialCondition(id) {
    const optionsR = api.makeRequest(
      formcServer + '/' + id + '/financial-condition', 
      'OPTIONS'
    );
    getOCCF(optionsR, 'financialCondition', {'id': id});
  },

  outstandingSecurity(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security', 'OPTIONS');
    getOCCF(optionsR, 'outstandingSecurity', {'id': id});
  },

  backgroundCheck(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/background-check', 'OPTIONS');
    getOCCF(optionsR, 'backgroundCheck', {'id': id});
  },

  finalReview(id) {

    $('#content').scrollTo();
    $.when(
        app.user.getFormcR(id, 'OPTIONS'),
        app.user.getFormcR(id),
    ).then((formcFields, formc) => {
      if(formc[0]) {
        app.user.formc = formc[0];
      }

      $.when(
        app.user.getCompanyR(formc[0].company_id, 'OPTIONS'),
        app.user.getCampaignR(formc[0].campaign_id, 'OPTIONS'),
        app.user.getCompanyR(formc[0].company_id, 'GET'),
        app.user.getCampaignR(formc[0].campaign_id, 'GET'),
      ).done((companyFields, campaignFields,  company, campaign) => {
      
        app.user.company = company[0];
        app.user.campaign = campaign[0];

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

      });
    })
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
