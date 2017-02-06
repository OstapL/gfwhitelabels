// ToDo
// Rewrite with promise
let userModel = Backbone.Model.extend({
  defaults: {
    token: '',
  },

  is_anonymous: function () {
    return this.get('token') == '';
  },

  ensureLoggedIn(next) {
    if (this.is_anonymous()) {
      const pView = require('components/anonymousAccount/views.js');
      let v = new pView.popupLogin({
        next: next || window.location.pathname,
      });
      v.render();
      app.hideLoading();

      return false;
    }

    return true;
  },

  getRoleInfo() {
    let role = this.get('role');
    role.role = role.role || [];

    return {
      companyName: role.company_name || '',
      companyId: role.company_id || 0,
      role: role.role.join(', ') || '',
    };
  },

  get_full_name: function () {
    return this.get('first_name') + ' ' + this.get('last_name');
  },

  load: function () {
    const ONE_HOURS = 1000 * 60 * 60;
    const token = localStorage.getItem('token');
    // if we have a token we can get information about user
    if (token !== null) {
      let userData = localStorage.getItem('user');
      this.set('token', token);
      cookies.set('token', token, {
        domain: '.' + domainUrl,
        expires: ONE_HOURS,
        path: '/',
      });

      // if (userData == null) {
      if (1 == 1) {
        this.fetch({
          url: authServer + '/rest-auth/data-mini',
          success: (data) => {
            localStorage.setItem('user', JSON.stringify(this.toJSON()));
            this.getCompanyR().done((companyD) => {
              this.set('company', companyD || null);
              app.trigger('userLoaded', this.toJSON());
              //app.routers.mainPage(); // TODO: FIX THAT !!!
            });
          },
          error: (model, xhr, status) => {
            localStorage.removeItem('token');
            app.defaultSaveActions.error(app, xhr, status, '');
          },
        });
      } else {
        userData = JSON.parse(userData);
        this.set(userData);
        app.trigger('userLoaded', userData);
      }
    } else {
      app.trigger('userLoaded', { id: '' });
    }
  },

  logout: function () {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    app.trigger('userLogout', {});
    window.location = '/';
  },

  company: null,
  campaign: null,
  formc: null,

  getCompanyR() {
    if(this.company == null) {
      return app.makeCacheRequest(authServer + '/user/company');
    } else {
      return '';
    }
  },

  getCompany() {
    return this.company;
  },

  getCampaignR() {
    if(this.campaign == null) {
      return app.makeCacheRequest(authServer + '/user/campaign');
    } else {
      return '';
    }
  },

  getCampaign() {
    return this.campaign;
  },

  getFormcR() {
    if(this.formc == null) {
      return app.makeCacheRequest(authServer + '/user/formc');
    } else {
      return '';
    }
  },

  getFormc() {
    return this.formc;
  },
});

module.exports = userModel;
