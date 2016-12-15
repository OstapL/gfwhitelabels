// ToDo
// Rewrite with promise
let userModel = Backbone.Model.extend({
  defaults: {
    token: '',
  },

  is_anonymous: function () {
    return this.get('token') == '';
  },

  get_full_name: function () {
    return this.get('first_name') + ' ' + this.get('last_name');
  },

  load: function () {
    // if we have a token we can get information about user
    if (localStorage.getItem('token') !== null) {
      let userData = localStorage.getItem('user');
      this.set('token', localStorage.getItem('token'));

      if (userData == null) {
        this.fetch({
          url: authServer + '/rest-auth/data',
          success: (data) => {
            localStorage.setItem('user', JSON.stringify(this.toJSON()));
            app.trigger('userLoaded', this.toJSON());
            //app.routers.mainPage(); // TODO: FIX THAT !!!
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
    $.ajax({
      type: 'POST',
      url: serverUrl + Urls.rest_logout(),
      success: (data) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        app.trigger('userLogout', data);
        window.location = '/';
      },
    });
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
