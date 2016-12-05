module.exports = Backbone.Router.extend({
  routes: {
    'company/create': 'company',
    'company/company-dashboard': 'companyDashboard',
    'company/:id/company-dashboard-first': 'companyDashboardFirst',
    'company/:id/after-payment-dashboard': 'afterPaymentDashboard',
    'company/:id/after-complete-dashboard': 'afterCompleteDashboard',
    'campaign/:id/general_information': 'generalInformation',
    'campaign/:id/media': 'media',
    'campaign/:id/team-members/add/:type/:index': 'teamMembersAdd',
    'campaign/:id/team-members': 'teamMembers',
    'campaign/:id/specifics': 'specifics',
    'campaign/:id/perks': 'perks',
    'campaign/:id/thankyou': 'thankyou',
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
  },

  company() {
    const View = require('components/raiseFunds/views.js');

    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    const companyR = app.makeCacheRequest(authServer + '/user/company');
    const campaignR = app.makeCacheRequest(authServer + '/user/campaign');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $('body').scrollTo(); 
    $.when(optionsR, companyR, campaignR, formcR).done((options, company, campaign, formc) => {
      const i = new View.company({
        el: '#content',
        fields: options[0].fields,
        model: company[0] || {},
        campaign: campaign[0] || {},
        formc: formc[0] || {},
      });

      app.hideLoading();
      i.render();
      //app.views.campaign[id].render();
      //app.cache[window.location.pathname] = i.$el.html();

    }).fail(function(xhr, response, error) {
      api.errorAction.call(this, $('#content'), xhr, response, error);
    });
  },

  companyDashboard: function() {
      const View = require('components/raiseFunds/views.js');
      let i = new View.companyDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },

  companyDashboardFirst:  function() {
      const View = require('components/raiseFunds/views.js');
      let i = new View.companyDashboardFirst({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  
  afterPaymentDashboard:  function() {
      const View = require('components/raiseFunds/views.js');
      let i = new View.afterPaymentDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  afterCompleteDashboard:  function() {
      const View = require('components/raiseFunds/views.js');
      let i = new View.afterCompleteDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  
  generalInformation (id) {
    const View = require('components/raiseFunds/views.js');

    $('#content').scrollTo(); 

    const metaR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/general_information', 'OPTIONS');
    const campaignR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/general_information');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $.when(metaR, campaignR, formcR).done((meta, model, formc) => {
      model[0].id = id;
      var i = new View.generalInformation({
        el: '#content',
        fields: meta[0].fields,
        model: model[0],
        formc: formc[0],
      });

      i.render();
      //app.cache[window.location.pathname] = i.$el.html();

      app.hideLoading();
    }).fail((xhr, error) =>  {
      api.errorAction($('#content'), xhr, error);
    });
  },

  media(id) {
    $('#content').scrollTo(); 

    const View = require('components/raiseFunds/views.js');
    const a1 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/media', 'OPTIONS');
    const a2 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/media');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $.when(a1, a2, formcR).done((meta, model, formc) => {
      model[0].id = id;

      var i = new View.media({
        el: '#content',
          fields: meta[0].fields,
          model: model[0],
          formc: formc[0],
      });
      i.render();
      //app.views.campaign[id].render();
      //app.cache[window.location.pathname] = i.$el.html();

      app.hideLoading();
    });
  },

  teamMembers(id) {
    $('body').scrollTo(); 
    const View = require('components/raiseFunds/views.js');
    const optionR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
    const dataR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members');

    $.when(optionR, dataR).done((fields, data) => {
      data[0].id = id;
      const i = new View.teamMembers({
        el: '#content',
        fields: fields[0],
        model: data[0],
      });
      i.render();

      app.hideLoading();
    });
  },

  teamMembersAdd(id, type, index) {
    $('body').scrollTo(); 

    const View = require('components/raiseFunds/views.js');
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
    const dataR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $.when(optionsR, dataR, formcR).done((fields, data, formc) => {
      data[0].id = id;
      const addForm = new View.teamMemberAdd({
        el: '#content',
        model: data[0],
        formc: formc[0],
        fields: fields[0].fields,
        type: type,
        index: index,
      });
      addForm.render();
      app.hideLoading();
    });
  },

  specifics(id) {
    const View = require('components/raiseFunds/views.js');
    const a1 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/specifics', 'OPTIONS');
    const a2 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/specifics');
    const a3 = app.makeCacheRequest(authServer + '/user/company');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $('body').scrollTo(); 
    $.when(a1, a2, a3, formcR).done((meta, model, company, formc) => {
      model[0].id = id;
      const i = new View.specifics({
        el: '#content',
        fields: meta[0].fields,
        model: model[0],
        company: company[0],
        formc: formc,
      });
      i.render();
      app.hideLoading();
    }).fail((xhr, error) =>  {
      app.defaultSaveActions.error.error($('#content'), error);
      app.hideLoading();
    });
  },

  perks(id) {
    const View = require('components/raiseFunds/views.js');

    const a1 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/perks', 'OPTIONS');
    const a2 = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/perks');
    const formcR = api.makeCacheRequest(authServer + '/user/formc');

    $('body').scrollTo(); 
    $.when(a1, a2, formcR).done((meta, model, formc) => {
      model[0].id = id;
      var i = new View.perks({
        el: '#content',
        fields: meta[0].fields,
        model: model[0],
        formc: formc[0],
      });
      i.render();

      app.hideLoading();
    });
  },    

  thankyou(id) {
    app.showLoading();
    $('body').scrollTo(); 
    const Model = require('components/campaign/models.js');
    const View = require('components/raiseFunds/views.js');

    var a2 = app.makeCacheRequest('/' + id);

    $.when(a2).done((campaign) => {
      var i = new View.thankYou({
        model: campaign,
      });
      i.render();
      //app.views.campaign[id].render();
      //app.cache[window.location.pathname] = i.$el.html();

      app.hideLoading();
    });
  },
   
});
