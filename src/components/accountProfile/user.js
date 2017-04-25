const Image = require('models/image.js');
const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;

    this.data = { token: '', id: ''};
    this.role_data = null;
    this.token = null;

    this.next = null;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  get first_name() {
    return this.data.first_name;
  }

  set first_name(value) {
    this.data.first_name = value;
  }

  get last_name() {
    return this.data.last_name;
  }

  set last_name(value) {
    this.data.last_name = value;
  }

  get companiesMember() {
    return this.data.info || [];
  }

  updateImage(imageData) {
    this.data.image_data = imageData;
    this.data.image_image_id = new Image(
      app.config.authServer + '/rest-auth/data',
      this.data.image_data
    );
    document.getElementById('user-thumbnail').src = this.data.image_image_id.getUrl('50x50');
    this.updateLocalStorage();
  }

  updateLocalStorage() {
      localStorage.setItem('token', this.data.token);
      localStorage.setItem('user', JSON.stringify(this.data));
  }

  setData(data, next) {

    next = next || this.next || app.getParams().next || '/';

    this.next = null;

    if(data.hasOwnProperty('token') && data.hasOwnProperty('info')) {
      this.data = data;
      this.updateLocalStorage();

      app.cookies.set('token', data.token, {
        domain: '.' + app.config.domainUrl,
        expires: YEAR,
        path: '/',
      });

      delete data.token;
      setTimeout(function() {
        window.location = next;
      }, 200);
    } else {
      alert('no token or additional info providet');
    }
  }

  emptyLocalStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    app.cookies.expire('token');
    this.token = null;
    this.data = {};
  }

  load() {
    this.token = localStorage.getItem('token');
    if (this.token === null) {
      return app.trigger('userLoaded', { id: '' });
    } else {
      const data = JSON.parse(localStorage.getItem('user')) || {};
      // Check if user have all required data
      if(data.hasOwnProperty('info') == false || Array.isArray(data.info) == false) {
        this.emptyLocalStorage();
        setTimeout(function() {
          window.location = '/account/login?next=' + document.location.pathname;
        }, 100);
        return;
      }

      data.image_image_id = new Image(
        app.config.authServer + '/rest-auth/data',
        data.image_data
      );
      this.data = data;

      return app.trigger('userLoaded', data);
    }
  }

  loadWithPromise() {
    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      if (this.token === null)
        return resolve({ id: '' });

      const data = JSON.parse(localStorage.getItem('user')) || {};
      // Check if user have all required data
      if (!data.info || !Array.isArray(data.info)) {
        this.emptyLocalStorage();
        setTimeout(() => {
          window.location = '/account/login?next=' + document.location.pathname;
        }, 100);

        return resolve(false);
      }

      data.image_image_id = new Image(
        app.config.authServer + '/rest-auth/data',
        data.image_data
      );
      this.data = data;
      return resolve(this.data);
    });
  }

  is_anonymous() {
    return !this.token;
  }

  toJSON() {
    const data = Object.assign({}, this.data, {'companiesMember': this.companiesMember});
    if(this.data.image_image_id) {
      data.image_image_id = data.image_image_id.id;
    }
    return data;
  }

  _initRoles() {
    if (!this.companiesMember || !this.companiesMember.length)
      return;

    this.role_data = [];

    _.each(this.companiesMember, (data) => {
      let roles = app.helpers.role.extractRoles(data.role);
      this.role_data.push({
        company: {
          id: data.company_id,
          name: data.company,
        },
        roles: roles,
      });
    });

  }

  getRolesInCompany(company_id) {
    if (!this.role_data)
      this._initRoles();

    if (!_.isNumber(company_id)) {
      return;
    }

    return _(this.role_data).find((data) => { return data.company.id == company_id; });
  }

  getRoles() {
    if (!this.role_data)
      this._initRoles();

    return this.role_data;
  }

  ensureLoggedIn(next) {
    if (this.is_anonymous()) {
      this.next = next || window.location.pathname;

      const pView = require('components/anonymousAccount/views.js');

      let v = $('#content').is(':empty')
        ? new pView.signup({
            el: '#content',
            model: {},
          })
        : new pView.popupLogin({});

      v.render();
      app.hideLoading();

      return false;
    }

    return true;
  }

  logout() {
    this.emptyLocalStorage();
    //TODO: looks like unnesessary code
    // app.trigger('userLogout', {});

    setTimeout(() => { window.location = '/';}, 100);
  }

  passwordChanged(data) {
    if (!data) {
      console.error('New data is empty');
      this.emptyLocalStorage();
      return;
    }

    this.setData(data);
  }

  getCompanyR(id) {
    if(id)  {
      return this.company ? '' : api.makeCacheRequest(app.config.raiseCapitalServer + '/company/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.company ? '' : api.makeCacheRequest(app.config.raiseCapitalServer + '/company/' + formcOwner[0].company_id, 'GET');
      }
    }
  }

  getCompany() {
    return this.company;
  }

  getCampaignR(id) {
    if(id)  {
      return this.campaign ? '' : api.makeCacheRequest(app.config.raiseCapitalServer + '/campaign/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.campaign ? '' : api.makeCacheRequest(app.config.raiseCapitalServer + '/campaign/' + formcOwner[0].campaign_id, 'GET');
      }
    }
  }

  getCampaign() {
    return this.campaign;
  }

  getFormcR(id) {
    if(id)  {
      return this.formc ? '' : api.makeCacheRequest(app.config.formcServer + '/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.formc ? '' : api.makeCacheRequest(app.config.formcServer + '/' + formcOwner[0].formc_id, 'GET');
      }
    }
  }

  getFormc() {
    return this.formc;
  }

  getCompaniesMemberR() {
    return this.companiesMember.length != 0 ? '' : api.makeCacheRequest(app.config.raiseCapitalServer + '/info');
  }

  getCompaniesMember() {
    return this.companiesMember;
  }

}

module.exports = () => {
  return new User();
};
