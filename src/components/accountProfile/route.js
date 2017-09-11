module.exports = {
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
  methods: {
    accountProfile(activeTab) {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        const fieldsR = api.makeCacheRequest(app.config.authServer + '/rest-auth/data', 'OPTIONS');
        const dataR = api.makeCacheRequest(app.config.authServer + '/rest-auth/data');

        $.when(fieldsR, dataR).done((fields, data) => {
          app.user.updateUserData(data[0]);
          app.currentView = new View.profile({
            el: '#content',
            model: app.user,
            fields: fields[0].fields,
            activeTab: activeTab,
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'profile_chunk');
    },

    logout(id) {
      // ToDo
      // Do we really want have to wait till user will be ready ?
      app.user.logout();
    },

    changePassword() {
      require.ensure([], (require) => {
        $('body').scrollTo();
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.changePassword({
          el: '#content',
          model: {},
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    setNewPassword() {
      require.ensure([], (require) => {
        $('body').scrollTo();
        const fieldsR = api.makeCacheRequest(app.config.authServer + '/rest-auth/password/change', 'OPTIONS');
        $.when(fieldsR).done((data) => {
          const View = require('components/accountProfile/views.js');
          app.currentView = new View.setNewPassword({
            el: '#content',
            //TODO: add fields from response
            // fields: data[0].fields,
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'profile_chunk');
    },

    investorDashboard() {
      require.ensure([], (require) => {
        $('body').scrollTo();
        const View = require('components/accountProfile/views.js');

        const fieldsR = api.makeCacheRequest(app.config.investmentServer + '/1/decline', 'OPTIONS');
        const userDataR = api.makeCacheRequest(app.config.authServer + '/rest-auth/data');
        const dataR = api.makeCacheRequest(app.config.investmentServer);

        Promise.all([fieldsR, dataR, userDataR]).then((values) => {
          Object.assign(app.user.data, values[2]);
          app.currentView = new View.InvestorDashboard({
            fields: values[0].fields,
            model: values[1],
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'profile_chunk');
    },

    companyDashboard() {
      require.ensure([], () => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.companyDashboard({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    companyDashboardFirst() {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.companyDashboardFirst({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    afterPaymentDashboard() {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.afterPaymentDashboard({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    afterCompleteDashboard() {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.afterCompleteDashboard({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    afterFinalDashboard() {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.afterFinalDashboard({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    afterSubmittingGovermentDashboard() {
      require.ensure([], (require) => {
        const View = require('components/accountProfile/views.js');
        app.currentView = new View.afterSubmittingGovermentDashboard({
          el: '#content',
        });
        app.currentView.render();
        app.hideLoading();
      }, 'profile_chunk');
    },

    issuerDashboard(id) {
      require.ensure([],(require) => {
        $('body').scrollTo();
        let params = {
          el: '#content'
        };

        let companyData = app.user.companiesMember.filter((el) => {
          return el.formc_id = id;
        });
        if(companyData.length == 0) {
          document.getElementById('#content').innerHTML = 'Sorry, but you are not belong to this company';
          return '';
        } else {
          companyData = companyData[0];
        }

        $.when(
          api.makeCacheRequest(app.config.raiseCapitalServer + '/company/' + companyData.company_id + '?noi=1', 'GET'),
          app.user.getCampaignR(companyData.campaign_id),
          app.user.getFormcR(companyData.formc_id),
          api.makeRequest(app.config.investmentServer + '/company/' + companyData.company_id + '?limit=300')
        ).done((company, campaign, formc, investors) => {

          if(company[0]) app.user.company = company[0];
          if(campaign[0]) app.user.campaign = campaign[0];
          if(formc[0]) app.user.formc = formc[0];

          params.company = new app.models.Company(
            app.user.company
          );
          params.campaign = new app.models.Campaign(
            app.user.campaign
          );
          params.formc = new app.models.Formc(
            app.user.formc
          );
          params.investors = investors[0];

          // FixMe
          // Temp fix for socialShare directive
          params.company.campaign = params.campaign;

          const View = require('components/accountProfile/views.js');
          app.currentView = new View.issuerDashboard(params);
          app.currentView.render();
          app.hideLoading();

        });
      }, 'profile_chunk');
    },

  },
  auth: [
    'accountProfile',
    'changePassword',
    'setNewPassword',
    'investorDashboard',
    'companyDashboard',
    'afterPaymentDashboard',
    'afterCompleteDashboard',
    'afterFinalDashboard',
    'afterSubmittingGovermentDashboard',
    'issuerDashboard',
  ],
};
