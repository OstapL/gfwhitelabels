
class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;
    this.companiesMember = [];

    this.data = { token: '', id: ''};
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
    //
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

  get_full_name() {
    return this.data.first_name + ' ' + this.data.last_name;
  }

  toJSON() {
    const data = Object.assign({}, this.data, {'companiesMember': this.companiesMember});
    return data;
  }

  getRoleInfo() {
    let role = this.data.role;
    role.role = role.role || [];

    return {
      companyName: role.company_name || '',
      companyId: role.company_id || 0,
      role: role.role.join(', ') || '',
    };
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

  getCompanyR() {
    return this.company ? '' : app.makeCacheRequest(authServer + '/user/company');
  }

  getCompany() {
    return this.company;
  }

  getCampaignR() {
    return this.campaign ? '' : app.makeCacheRequest(authServer + '/user/campaign');
  }

  getCampaign() {
    return this.campaign;
  }

  getFormcR(id) {
    if(id) 
      return this.formc ? '' : app.makeCacheRequest(formcServer + '/' + id);
    else
      return this.formc ? '' : app.makeCacheRequest(authServer + '/user/formc');
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
