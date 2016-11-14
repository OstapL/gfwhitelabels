module.exports = Backbone.Router.extend({
  routes: {
    'company/create': 'company',
    'company/company-dashboard': 'companyDashboard',
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
    if (!app.user.is_anonymous()) {
      const Model = require('components/company/models.js');
      const View = require('components/raiseFunds/views.js');

      const optionsR = app.makeCacheRequest(raiseCapitalUrl + '/company', 'OPTIONS');
      const companyR = app.makeCacheRequest(authServer + '/user/company');
      const campaignR = app.makeCacheRequest(authServer + '/user/campaign');

      $.when(optionsR, companyR, campaignR).done((options, company, campaign) => {
        $('body').scrollTo(); 
        var i = new View.company({
          el: '#content',
          fields: options[0].fields,
          model: company[0] || {},
          campaign: campaign[0] || {},
        });

        app.hideLoading();
        i.render();
        //app.views.campaign[id].render();
        //app.cache[window.location.pathname] = i.$el.html();

      }).fail(function(xhr, response, error) {
        api.errorAction.call(this, $('#content'), xhr, response, error);
      });
    } else {
      app.routers.navigate(
          '/account/login', {trigger: true, replace: true}
      );
    }
  },
  companyDashboard: function() {
      const View = require('components/raiseFunds/views.js');
      let i = new View.companyDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  }, 
  generalInformation (id) {
    if (!app.user.is_anonymous()) {
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      if (id === null) {
        alert('please set up id or company_id');
        console.log('not goinng anywhere');
        return;
      }
      $('#content').scrollTo(); 

      var a1 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/general_information', 'OPTIONS');
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/general_information');
      // let formcR = api.makeCacheRequest(authServer + '/user/formc');

      // $.when(a1, a2, formcR).done((meta, model, formc) => {
      $.when(a1, a2).done((meta, model) => {
        model[0].id = id;
        var i = new View.generalInformation({
          el: '#content',
          fields: meta[0].fields,
          model: model[0],
          // formc: formc[0],
        });

        i.render();
        //app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
      }).fail((xhr, error) =>  {
        api.errorAction($('#content'), xhr, error);
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  media(id) {
    if (!app.user.is_anonymous()) {
      $('#content').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      var a1 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/media', 'OPTIONS');
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/media');

      // var a1 = app.makeCacheRequest(Urls['campaign-list']() + '/media/' + id, 'OPTIONS');
      // var a2 = app.makeCacheRequest(Urls['campaign-list']() + '/media/' + id);

      $.when(a1, a2).done((meta, model) => {
        model[0].id = id;
        var i = new View.media({
          el: '#content',
            fields: meta[0].fields,
            // model: new Model.model(model[0])
            model: model[0],
        });
        i.render();
        //app.views.campaign[id].render();
        //app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  teamMembers(id) {
    if (!app.user.is_anonymous()) {
      $('body').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      // var a2 = app.makeCacheRequest(Urls['campaign-list']() + '/team_members/' + id);
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/team_members');

      $.when(a2).done((model) => {
        model.id = id;
        var i = new View.teamMembers({
          el: '#content',
          // model: new Model.model(model),
          model: model,
        });
        i.render();
        //app.views.campaign[id].render();
        //app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  teamMembersAdd(id, type, index) {
    if (!app.user.is_anonymous()) {
      $('body').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      // var a2 = app.makeCacheRequest(Urls['campaign-list']() + '/team_members/' + id);
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/team_members');
      $.when(a2).done((model) => {
        const addForm = new View.teamMemberAdd({
          el: '#content',
          // model: new Model.model(model),
          model: model,
          type: type,
          index: index,
        });
        addForm.render();
        app.hideLoading();
      });

    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  specifics(id) {
    if (!app.user.is_anonymous()) {
      $('body').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      var a1 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/specifics', 'OPTIONS');
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/specifics');
      var a3 = app.makeCacheRequest(authServer + '/user/company');

      $.when(a1, a2, a3).done((meta, model, company) => {
        model[0].id = id;
        model[0].company = company[0];
        var i = new View.specifics({
          el: '#content',
          fields: meta[0].fields,
          model: model[0],
        });
        i.render();
        app.hideLoading();
      }).fail((xhr, error) =>  {
        app.defaultSaveActions.error.error($('#content'), error);
        app.hideLoading();
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  perks(id) {
    if (!app.user.is_anonymous()) {
      $('body').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      var a1 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/perks', 'OPTIONS');
      var a2 = app.makeCacheRequest(raiseCapitalUrl + '/campaign/' + id + '/perks');

      $.when(a1, a2).done((meta, model) => {
        model[0].id = id;
        var i = new View.perks({
          el: '#content',
          fields: meta[0].fields,
          // model: new Model.model(model[0]),
          model: model[0],
        });
        i.render();
        //app.views.campaign[id].render();
        //app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },    

  thankyou(id) {
    if (!app.user.is_anonymous()) {
      app.showLoading();
      $('body').scrollTo(); 
      const Model = require('components/campaign/models.js');
      const View = require('components/raiseFunds/views.js');

      var a2 = app.makeCacheRequest(Urls['campaign-detail'](id));

      $.when(a2).done((campaign) => {
        var i = new View.thankYou({
          model: campaign,
        });
        i.render();
        //app.views.campaign[id].render();
        //app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },
   
});
