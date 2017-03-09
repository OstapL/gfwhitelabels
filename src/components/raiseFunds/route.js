const View = require('components/raiseFunds/views.js');
const raiseHelper = require('./helpers.js');
const STATUSES = require('consts/raisecapital/companyStatuses.json').STATUS;


function getOCCF(optionsR, viewName, params = {}) {

  $('body').scrollTo();
  params.el = '#content';

  $.when(
    api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS'),
    api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS'),
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

    params.company = app.user.company;
    params.campaign = app.user.campaign;
    params.formc = app.user.formc;

    if(typeof viewName == 'string') {
      new View[viewName](Object.assign({}, params)).render();
      app.hideLoading();
    } else {
      viewName();
    }

  });
};

module.exports = {
  routes: {
    'company/create': 'company',
    'company/in-review': 'inReview',
    'campaign/:id/general_information': 'generalInformation',
    'campaign/:id/media': 'media',
    'campaign/:id/team-members/add/:type/:index': 'teamMembersAdd',
    'campaign/:id/team-members': 'teamMembers',
    'campaign/:id/specifics': 'specifics',
    'campaign/:id/perks': 'perks',
  },

  methods: {
    company() {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
      $(document.head).append('<meta name="keywords" content="local investing equity crowdfunding Get to work and secure funding with our equity crowdfunding platform. Harness the power of local investing to secure the capital you need by getting started."></meta>');
      getOCCF(optionsR, 'company', {});
    },

    generalInformation (id) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/general_information', 'OPTIONS');
      getOCCF(optionsR, 'generalInformation', {});
    },

    media(id) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/media', 'OPTIONS');
      getOCCF(optionsR, 'media', {});
    },

    teamMembers(id) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
      getOCCF(optionsR, 'teamMembers', {});
    },

    teamMembersAdd(id, type, index) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
      getOCCF(optionsR, 'teamMemberAdd', {
        type: type,
        index: index,
      });
    },

    specifics(id) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/specifics', 'OPTIONS');
      getOCCF(optionsR, 'specifics', {});
    },

    perks(id) {
      const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/perks', 'OPTIONS');
      getOCCF(optionsR, 'perks', {});
    },    

    inReview() {
      app.showLoading();

      $('#company_publish_confirm').modal('hide', 0);
      let fn = function() {
        $('body').scrollTo();
        app.hideLoading();
        if(app.user.company.is_approved == STATUSES.PENDING) {
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

    },
  },
  auth: '*',
};
