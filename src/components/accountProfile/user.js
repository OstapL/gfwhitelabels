const roleHelper = require('helpers/roleHelper.js');
const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;
    this.companiesMember = [];

    this.data = { token: '', id: ''};
    this.role_data = null;
    this.token = null;
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

  setData(data) {
    if(data.hasOwnProperty('token') && data.hasOwnProperty('info')) {
      localStorage.setItem('token', data.token);
      delete data.token;
      localStorage.setItem('user', JSON.stringify(data));

      cookies.set('token', data.token, {
        domain: '.' + domainUrl,
        expires: YEAR,
        path: '/',
      });

      setTimeout(function() {
        window.location = app.getParams().next ? app.getParams().next : 
              '/';
      }, 200);
    } else {
      alert('not token or info providet');
    }
  }

  emptyLocalStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    cookies.expire('token');
    this.token = null;
    this.data = {};
    this.companiesMember = [];
  }

  load() {
    this.token = localStorage.getItem('token');
    if (this.token === null) {
      return app.trigger('userLoaded', { id: '' });
    } else {
      const data = JSON.parse(localStorage.getItem('user'));
      this.companiesMember = data.info;
      delete data.info;
      this.data = data;

      // Check if user have all required data
      if(this.companiesMember == null) {
        this.emptyLocalStorage();
        setTimeout(function() {
          window.location = '/account/login?next=' + document.location.pathname;
        }, 100);
        return;
      }
      return app.trigger('userLoaded', data);
    }
  }

  is_anonymous() {
    return !this.token;
  }

  toJSON() {
    const data = Object.assign({}, this.data, {'companiesMember': this.companiesMember});
    return data;
  }

  _initRoles() {
    if (!this.companiesMember || !this.companiesMember.length)
      return;

    this.role_data = [];

    _.each(this.companiesMember, (data) => {
      let roles = roleHelper.extractRoles(data.role);
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

    if (!_.isNumber(company_id))
      return;

    return _(this.role_data).find((data) => { return data.company.id == company_id; });
  }

  getRoles() {
    if (!this.role_data)
      this._initRoles();

    return this.role_data;
  }

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
  }

  logout() {
    this.emptyLocalStorage();
    app.trigger('userLogout', {});

    setTimeout(() => { window.location = '/';}, 100);
  }

  passwordChanged(data) {
    if (!token) {
      console.error('New token is empty');
      this.emptyLocalStorage();
      return;
    }

    this.setData(data);
  }

  getCompanyR(id) {
    if(id)  {
      return this.company ? '' : app.makeCacheRequest(raiseCapitalServer + '/company/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.company ? '' : app.makeCacheRequest(raiseCapitalServer + '/company/' + formcOwner[0].company_id, 'GET');
      }
    }
  }

  getCompany() {
    return this.company;
  }

  getCampaignR(id) {
    if(id)  {
      return this.campaign ? '' : app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.campaign ? '' : app.makeCacheRequest(raiseCapitalServer + '/campaign/' + formcOwner[0].campaign_id, 'GET');
      }
    }
  }

  getCampaign() {
    return this.campaign;
  }

  getFormcR(id) {
    if(id)  {
      return this.formc ? '' : app.makeCacheRequest(formcServer + '/' + id, 'GET');
    } else {
      let formcOwner = this.companiesMember.filter((el) => {
        return el.owner_id = this.data.id;
      });
      if(formcOwner.length == 0) {
        return '';
      }
      else {
        return this.formc ? '' : app.makeCacheRequest(formcServer + '/' + formcOwner[0].formc_id, 'GET');
      }
    }
  }

  getFormc() {
    return this.formc;
  }

  getCompaniesMemberR() {
    return this.companiesMember.length != 0 ? '' : app.makeCacheRequest(raiseCapitalServer + '/info');
  }

  getCompaniesMember() {
    return this.companiesMember;
  }

}

module.exports = () => {
  return new User();
};
