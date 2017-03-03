const roleHelper = require('helpers/roleHelper.js');

class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;
    this.companiesMember = [];

    this.data = { token: '', id: ''};
    this.roleHelper = roleHelper;
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

  load() {
    const ONE_HOUR = 1000 * 60 * 60;

    const token = localStorage.getItem('token');
    if (token === null)
      return app.trigger('userLoaded', { id: '' });

    // if we have a token we can get information about user
    this.token = token;
    cookies.set('token', token, {
      domain: '.' + domainUrl,
      expires: ONE_HOUR,
      path: '/',
    });

    // let userData = localStorage.getItem('user');
    // userData = JSON.parse(userData);
    // this.set(userData);
    // app.trigger('userLoaded', userData);
    // return;

    $.when(
        api.makeRequest(authServer + '/rest-auth/data-mini', 'GET'),
        this.getCompaniesMemberR()
    ).then((data, members) => {
      this.data = data[0];
      this.companiesMember = members[0];
      localStorage.setItem('user', JSON.stringify(this.data));
      return this.getCompanyR();
    }).then((company) => {
      this.data.company = company;
      app.trigger('userLoaded', this.data);
    }).fail((xhr, status) => {
      localStorage.removeItem('token');
      app.defaultSaveActions.error(app, xhr, status, '');
    });

  }

  is_anonymous() {
    return !this.token;
  }

  toJSON() {
    const data = Object.assign({}, this.data, {'companiesMember': this.companiesMember});
    return data;
  }

  _initRoles() {
    if (!this.companiesMember || !this.companiesMember.data || !this.companiesMember.data.length)
      return;

    this.role_data = [];

    _.each(this.companiesMember.data, (data) => {
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    app.trigger('userLogout', {});
    window.location = '/';
  }

  getCompanyR(id, requestMethod='GET') {
    if(id) 
      return this.company ? '' : app.makeCacheRequest(raiseCapitalServer + '/company/' + id, requestMethod);
    else
      return this.company ? '' : app.makeCacheRequest(authServer + '/user/company', requestMethod);
  }

  getCompany() {
    return this.company;
  }

  getCampaignR(id, requestMethod='GET') {
    if(id) 
      return this.campaign ? '' : app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id, requestMethod);
    else
      return this.campaign ? '' : app.makeCacheRequest(authServer + '/user/campaign', requestMethod);
  }

  getCampaign() {
    return this.campaign;
  }

  getFormcR(id, requestMethod='GET') {
    if(id) 
      return this.formc ? '' : app.makeCacheRequest(formcServer + '/' + id, requestMethod);
    else
      return this.formc ? '' : app.makeCacheRequest(authServer + '/user/formc', requestMethod);
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
