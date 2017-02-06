module.exports = Backbone.Router.extend({
  routes: {
    'account/profile(?:active_tab)': 'accountProfile',
    'account/logout': 'logout',
    'account/change-password': 'changePassword',
    'account/password/new': 'setNewPassword',
    'account/investor-dashboard': 'investorDashboard',
    'account/company-dashboard': 'companyDashboard',
    'account/company-dashboard-first': 'companyDashboardFirst',
    'account/after-payment-dashboard': 'afterPaymentDashboard',
    'account/after-complete-dashboard': 'afterCompleteDashboard',
    'account/after-final-submit-dashboard': 'afterFinalDashboard',
    'account/after-submitting-goverment-dashboard': 'afterSubmittingGovermentDashboard',
    'dashboard/:id/issuer-dashboard': 'issuerDashboard',
  },

  execute: function (callback, args, name) {
    if (name !== 'logout' && !app.user.ensureLoggedIn(window.location.pathname)) {
      return false;
    }
    if (callback) callback.apply(this, args);
  },  

  accountProfile(active_tab) {
    if(!app.user.is_anonymous()) {
      require.ensure([], function() {
        const View = require('components/accountProfile/views.js');

        const fieldsR = app.makeCacheRequest(authServer + '/rest-auth/data', 'OPTIONS');
        const dataR = app.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(fieldsR, dataR).done((fields, data) => {
          const i = new View.profile({
            el: '#content',
            model: data[0],
            fields: fields[0].fields,
            activeTab: active_tab,
          });
          i.render();
          app.hideLoading();
        })
      });
    } else {
      app.routers.navigate(
        '/account/login', {trigger: true, replace: true}
      );
    }
  },

  logout(id) {
    // ToDo
    // Do we really want have to wait till user will be ready ?
    app.user.logout();
  },

  changePassword: function() {
    require.ensure([], function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.changePassword({
        el: '#content',
        model: {},
      });
      i.render();
      app.hideLoading();
    });
  },

  setNewPassword: function() {
    $('body').scrollTo();
    const View = require('components/accountProfile/views.js');
    const i = new View.setNewPassword({
      el: '#content',
    });
    i.render();
    app.hideLoading();
  },

  investorDashboard() {
    const View = require('components/accountProfile/views.js');

    const fieldsR = app.makeCacheRequest(investmentServer, 'OPTIONS');
    const dataR = app.makeCacheRequest(investmentServer);

    Promise.all([fieldsR, dataR]).then((values) => {
        let i = new View.InvestorDashboard({
          fields: values[0].fields,
          model: values[1],
        });
        i.render();
        app.hideLoading();
      }).catch((err) => {
        console.log(err);
      });
  },

  companyDashboard: function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.companyDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },

  companyDashboardFirst:  function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.companyDashboardFirst({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  
  afterPaymentDashboard:  function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.afterPaymentDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  afterCompleteDashboard:  function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.afterCompleteDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  afterFinalDashboard:  function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.afterFinalDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  afterSubmittingGovermentDashboard:  function() {
      const View = require('components/accountProfile/views.js');
      let i = new View.afterSubmittingGovermentDashboard({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  issuerDashboard: function(id) {
    $('#content').scrollTo();
    $.when(
        api.makeCacheRequest(formcServer + '/' + id, 'OPTIONS'),
        app.user.getFormcR(id),
    ).then((formcFields, formc) => {

      if(formc[0]) {
        app.user.formc = formc[0];
      }

      // noi=1 means that server should return number_of_investrs for company
      $.when(
        app.makeCacheRequest(raiseCapitalServer + '/company/' + id + '/edit?noi=1', 'GET'),
        app.user.getCampaignR(app.user.formc.campaign_id, 'GET'),
      ).done((company, campaign) => {
      
        app.user.company = company[0];
        app.user.campaign = campaign[0];

        var model = app.user.company;
        model.campaign = app.user.campaign;
        model.formc = app.user.formc;

        const View = require('components/accountProfile/views.js');
        new View.issuerDashboard({
          el: '#content',
          model: model
        }).render();
        app.hideLoading();

      });
    })

    /*
    $.when(app.user.getCompanyR(), app.user.getCampaignR()).done((company, campaign) => {
      if(company[0]) {
        app.user.company = company[0];
      }
      if(campaign[0]) {
        app.user.campaign = campaign[0];
      }

      var model = app.user.company;
      model.campaign = app.user.campaign;
      
      const View = require('components/accountProfile/views.js');
      let i = new View.issuerDashboard({
        el: '#content',
        model: model
      });
      i.render();
      app.hideLoading();
    });
    */
  },
});    
