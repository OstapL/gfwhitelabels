module.exports = Backbone.Router.extend({
  routes: {
    'account/profile': 'accountProfile',
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
    'dashboard/issuer-dashboard': 'issuerDashboard',
  },

  execute: function (callback, args, name) {
    if (app.user.is_anonymous() && name !== 'logout') {
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

  accountProfile() {
    if(!app.user.is_anonymous()) {
      require.ensure([], function() {
        const View = require('components/accountProfile/views.js');

        const fieldsR = app.makeCacheRequest(authServer + '/rest-auth/data', 'OPTIONS');
        const dataR = app.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(fieldsR, dataR).done((fields, data) => {
          const i = new View.profile({
            el: '#content',
            model: data[0],
            fields: fields[0].fields
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
  issuerDashboard: function() {
    app.makeCacheRequest(authServer + '/user/company').done((company) => {
      app.makeCacheRequest(raiseCapitalServer + '/' + company.id).done((detail) => {
        const View = require('components/accountProfile/views.js');
        let i = new View.issuerDashboard({
          el: '#content',
          model: detail,
          company: company,
        });
        i.render();
        app.hideLoading();
      });;
    });
    //
    // require.ensure([], function() {
    //
    //   });
  },
});    
