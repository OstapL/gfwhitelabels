const View = require('components/raiseFunds/views.js');
const raiseHelper = require('./helpers.js');

function getOCCF(optionsR, viewName, params = {}) {

  $('#content').scrollTo();
  params.el = '#content';

  $.when(
      app.user.getFormcR(params.id),
  ).then((formcFields, formc) => {
    if(formc[0]) {
      app.user.formc = formc[0];
    }

    $.when(
      api.makeCacheRequest(raiseCapitalServer + '/company/' + app.user.formc.company_id + '/edit', 'OPTIONS'),
      api.makeCacheRequest(raiseCapitalServer + '/campaign/' + app.user.formc.company_id + '/edit', 'OPTIONS'),
      app.user.getCompanyR(app.user.formc.company_id, 'GET'),
      app.user.getCampaignR(app.user.formc.campaign_id, 'GET'),
    ).done((companyFields, campaignFields,  company, campaign) => {
    
      const fields = {
        company: companyFields[0].fields,
        campaign: campaignFields[0].fields,
        formc: formcFields[0].fields,
      };

      if(company[0]) app.user.company = company[0];
      if(campaign[0]) app.user.campaign = campaign[0];

      var model = app.user.company;
      model.campaign = app.user.campaign;
      model.formc = app.user.formc;
      
      const finalReviewView = new View.finalReview({
        el: '#content',
        fields: fields,
        model: model,
        formcId: id,
      });
      finalReviewView.render();
      app.hideLoading();

    });
  })
/*
  $.when(optionsR, app.user.getCompanyR(), app.user.getCampaignR(), app.user.getFormcR())
    .done((options, company, campaign, formc) => {

      if(options) {
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

      if(typeof viewName == 'string') {
        new View[viewName](Object.assign({}, params)).render();
        app.hideLoading();
      } else {
        viewName();
      }

      raiseHelper.updateMenu(raiseHelper.calcProgress(app.user.campaign));
    }).fail(function(xhr, response, error) {
      api.errorAction.call(this, $('#content'), xhr, response, error);
    });
    */
};

module.exports = Backbone.Router.extend({
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

  execute: function (callback, args, name) {
    //ga('send', 'pageview', "/" + Backbone.history.getPath());
    if (!app.user.ensureLoggedIn(window.location.pathname))
      return false;

    if (callback) callback.apply(this, args);
  },

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
      if(app.user.company.is_approved == 1) {
        const i = new View.inReview({
          model: app.user.company,
        });
        i.render();
      } else if(app.user.company.is_approved == 5) {
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

    getOCCF('', fn);
  },
   
});
