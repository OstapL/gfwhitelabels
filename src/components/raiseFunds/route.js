const STATUSES = require('consts/raisecapital/companyStatuses.json').STATUS;


function getOCCF(optionsR, viewName, params = {}, View) {

  $('body').scrollTo();
  params.el = '#content';

  $.when(
    api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
    api.makeCacheRequest(app.config.raiseCapitalServer + '/campaign', 'OPTIONS'),
    app.user.getCompanyR(),
    app.user.getCampaignR(),
    app.user.getFormcR()
  ).done((companyFields, campaignFields,  company, campaign, formc) => {
  
    params.fields = {
      company: companyFields[0].fields,
      campaign: campaignFields[0].fields,
    };

    if(company[0]) app.user.company = company[0];
    if(campaign[0]) app.user.campaign = campaign[0];
    if(formc[0]) app.user.formc = formc[0];

    params.company = new app.models.Company(
      app.user.company,
      params.fields.company
    ) || {};
    params.campaign = new app.models.Campaign(
      app.user.campaign,
      params.fields.campaign
    );
    params.formc = new app.models.Formc(app.user.formc);

    if(typeof viewName == 'string') {
      app.currentView = new View[viewName](Object.assign({}, params));
      app.currentView.render();
      app.hideLoading();
    } else {
      app.currentView = viewName();
      app.currentView.render();
    }
  });
};


module.exports = {
  routes: {
    'raise-capital': 'landing',
    'company/create': 'company',
    'company/in-review': 'inReview',
    'campaign/:id/general_information': 'generalInformation',
    'campaign/:id/media': 'media',
    'campaign/:id/team-members/add/:type/:index': 'teamMembersAdd1',
    'campaign/:id/team-members': 'teamMembers1',
    'campaign/:id/specifics': 'specifics',
    'campaign/:id/perks': 'perks',
  },
  methods: {
    landing() {
      $('body').scrollTo();
      require.ensure([], () => {
        const Views = require('components/raiseFunds/views.js');
        app.currentView = new Views.landing();
        app.currentView.render();
        app.hideLoading();
      }, 'raise_funds_chunk');
    },

    company() {

      if (app.user.data.info.length == 0 &&
          app.getParams().nolanding != 1 &&
          window.location.pathname != '/raise-capital') {
        app.routers.navigate('/raise-capital', {trigger: true, replace: false});
        return false;
      }

      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsR = api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS');
        app.setMeta({
          name: 'keywords',
          content: 'local investing equity crowdfunding Get to ' +
            'work and secure funding with our equity crowdfunding platform. Harness the power of ' +
            'local investing to secure the capital you need by getting started.',
        });
        getOCCF(optionsR, 'company', {}, View);
      }, 'raise_funds_chunk');
    },

    generalInformation(id) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'generalInformation', {}, View);
      }, 'raise_funds_chunk');
    },

    media(id) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'media', {}, View);
      }, 'raise_funds_chunk');
    },

    teamMembers1(id) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');
        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'teamMembers', {}, View);
      }, 'raise_funds_chunk');
    },

    teamMembersAdd1(id, type, index) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'teamMemberAdd', {
          type: type,
          index: index,
        }, View);
      }, 'raise_funds_chunk');
    },

    specifics(id) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'specifics', {}, View);
      }, 'raise_funds_chunk');
    },

    perks(id) {
      require.ensure([], () => {
        const View = require('components/raiseFunds/views.js');

        const optionsUrl = app.config.raiseCapitalServer + '/campaign';
        const optionsR = api.makeCacheRequest(optionsUrl, 'OPTIONS');
        getOCCF(optionsR, 'perks', {}, View);
      }, 'raise_funds_chunk');
    },

    inReview() {
      app.showLoading();

      require.ensure([], (require) => {
        $('#company_publish_confirm').modal('hide', 0);
        let view = function() {
          $('body').scrollTo();
          app.hideLoading();

          if(app.user.company.is_approved == STATUSES.PENDING) {
            const View = require('components/raiseFunds/views.js');
            const i = new View.inReview({
              model: app.user.company,
            });
            i.render();
          } else if(app.user.company.is_approved == STATUSES.APPROVED) {
            app.routers.navigate(
              '/formc/' + app.user.formc.id + '/introduction',
              { trigger: true, replace: false }
            );
          } else {
            app.routers.navigate(
              '/company/create',
              { trigger: true, replace: false }
            );
          }
        };

        getOCCF('', view);
      }, 'raise_funds_chunk');
    },
  },
  auth: [
    'company',
    'inReview,',
    'inReview',
    'generalInformation',
    'media',
    'teamMembersAdd1',
    'teamMembers1',
    'specifics',
    'perks',
  ]
};
