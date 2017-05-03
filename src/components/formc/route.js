//TODO: remove view into methods
const formcHelpers = require('./helpers.js');
const STATUSES = require('consts/raisecapital/companyStatuses.json').STATUS;

function getOCCF(optionsR, viewName, params = {}, View) {
  $('body').scrollTo();
  params.el = '#content';
  $.when(
    optionsR,
    app.user.getCompanyR(),
    app.user.getCampaignR(),
    app.user.getFormcR(params.id)
  ).done((options, company, campaign, formc) => {

    if (options) {
      params.fields = options[0].fields;
    }

    // ToDo
    // This how we can avoid empty response
    if (!company) {
      params.company = app.user.company;
      params.campaign = app.user.campaign;
      params.formc = app.user.formc;
    } else {
      if(options) {
        params.fields = options[0].fields;
      }

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

    if (params.company.is_approved < STATUSES.APPROVED) {
      app.dialogs.info('Sorry, your campaign is not approved yet. Please wait till we check your campaign').then(() => {
        app.routers.navigate('/campaign/' + params.campaign.id + '/general_information', {
          trigger: true,
          replace: true,
        });
      });
      return false;
    }

    if (params.formc.is_paid == false && viewName != 'introduction') {
      app.routers.navigate('/formc/' + params.formc.id + '/introduction?notPaid=1', {
        trigger: true,
        replace: true,
      });
      return false;
    }
    params.company = new app.models.Company(app.user.company) || {};
    params.campaign = new app.models.Campaign(app.user.campaign);
    params.formc = new app.models.Formc(app.user.formc);

    if (typeof viewName == 'string') {
      new View[viewName](Object.assign({}, params)).render();
      app.hideLoading();
    } else {
      viewName();
    }

    formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
  }).fail(function (xhr, response, error) {
    if (xhr.responseJSON.location) {
      app.routers.navigate('/formc' + response.responseJSON.location + '?notPaid=1', {
        trigger: true,
        replace: true,
      });
    }
  });
};

module.exports = {
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
    'formc/:id/formc-elecrtonic-signature': 'electronicSignature',
    'formc/:id/formc-elecrtonic-signature-company': 'electronicSignatureCompany',
    'formc/:id/formc-elecrtonic-signature-cik': 'electronicSignatureCik',
    'formc/:id/formc-elecrtonic-signature-financial-certification': 'electronicSignatureFinancials',
  },
  methods: {
    introduction(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsR = api.makeCacheRequest(app.config.formcServer + '/' + id + '/introduction', 'OPTIONS');
        getOCCF(optionsR, 'introduction', { id: id }, View);
      });
    },

    teamMembers(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/team-members/employers';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'teamMembers', { id: id }, View);
      });
    },

    teamMemberAdd(id, role, userId) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/team-members/' + role;
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'teamMemberAdd', {
          role: role,
          user_id: userId,
          id: id,
        }, View);
      });
    },

    relatedParties(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsR = api.makeCacheRequest(app.config.formcServer + '/' + id + '/related-parties', 'OPTIONS');
        getOCCF(optionsR, 'relatedParties', { id: id }, View);
      });
    },

    useOfProceeds(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsR = api.makeCacheRequest(app.config.formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
        getOCCF(optionsR, 'useOfProceeds', { id: id }, View);
      });
    },

    riskFactorsInstruction(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        getOCCF('', 'riskFactorsInstruction', { id: id }, View);
      });
    },

    riskFactorsMarket(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-market';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsMarket', { id: id }, View);
      });
    },

    riskFactorsFinancial(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-financial';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsFinancial', { id: id }, View);
      });
    },

    riskFactorsOperational(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-operational';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsOperational', { id: id }, View);
      });
    },

    riskFactorsCompetitive(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-competitive';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsCompetitive', { id: id }, View);
      });
    },

    riskFactorsPersonnel(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-personnel';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsPersonnel', { id: id }, View);
      });
    },

    riskFactorsLegal(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-legal';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsLegal', { id: id }, View);
      });
    },

    riskFactorsMisc(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/risk-factors-misc';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'riskFactorsMisc', { id: id }, View);
      });
    },

    financialCondition(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsR = api.makeRequest(app.config.formcServer + '/' + id + '/financial-condition', 'OPTIONS');
        getOCCF(optionsR, 'financialCondition', { id: id }, View);
      });
    },

    outstandingSecurity(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/outstanding-security';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'outstandingSecurity', { id: id }, View);
      });
    },

    backgroundCheck(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        const optionsUrl = app.config.formcServer + '/' + id + '/background-check';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'backgroundCheck', { id: id }, View);
      });
    },

    finalReview(id) {
      require.ensure([], () => {
        $('body').scrollTo();
        const View = require('components/formc/views.js');
        const formcOptionsR = api.makeCacheRequest(app.config.formcServer + '/' + id, 'OPTIONS');
        $.when(formcOptionsR, app.user.getFormcR(id)).then((formcFields, formc) => {
          if (formc[0]) {
            app.user.formc = formc[0];
          }

          const companyUrl = app.config.raiseCapitalServer + '/company/' + app.user.formc.company_id;
          const campaignUrl = app.config.raiseCapitalServer + '/campaign/' + app.user.formc.company_id;
          $.when(
            api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
            api.makeCacheRequest(app.config.raiseCapitalServer + '/campaign', 'OPTIONS'),
            app.user.getCompanyR(app.user.formc.company_id, 'GET'),
            app.user.getCampaignR(app.user.formc.campaign_id, 'GET'),
          ).done((companyFields, campaignFields, company, campaign) => {

            const fields = {
              company: companyFields[0].fields,
              campaign: campaignFields[0].fields,
              formc: formcFields[0].fields,
            };

            if (company[0]) app.user.company = company[0];
            if (campaign[0]) app.user.campaign = campaign[0];

            var model = new app.models.Company(app.user.company);
            model.campaign = new app.models.Campaign(app.user.campaign);
            model.formc = new app.models.Formc(app.user.formc);

            const finalReviewView = new View.finalReview({
              el: '#content',
              fields: fields,
              model: model,
              formcId: id,
            });
            finalReviewView.render();
            if (location.hash && $(location.hash).length) {
              setTimeout(() => {
                $(location.hash).scrollTo(65);
              }, 300);
            } else {
              $('body').scrollTo();
            }
            app.hideLoading();

          });
        });
      });
    },

    electronicSignature(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        let i = new View.electronicSignature({
          el: '#content',
        });
        i.render();
        app.hideLoading();
      });
    },

    electronicSignatureCompany(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        let i = new View.electronicSignatureCompany({
          el: '#content',
        });
        i.render();
        app.hideLoading();
      });
    },

    electronicSignatureCik(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        let i = new View.electronicSignatureCik({
          el: '#content',
        });
        i.render();
        app.hideLoading();
      });
    },

    electronicSignatureFinancials(id) {
      require.ensure([], () => {
        const View = require('components/formc/views.js');
        let i = new View.electronicSignatureFinancials({
          el: '#content',
        });
        i.render();
        app.hideLoading();
      });
    },
  },
};
