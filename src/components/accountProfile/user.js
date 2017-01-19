
class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;

    this.user = { token: '', id: ''};
    this.token = null;
  }

  get(key) {
    return this.user[key];
  }

  set(key, value) {
    this.user[key] = value;
  }

  get first_name() {
    return this.user.first_name;
  }

  set first_name(value) {
    this.user.first_name = value;
  }

  get last_name() {
    return this.user.last_name;
  }

  set last_name(value) {
    this.user.last_name = value;
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

    api.makeRequest(authServer + '/rest-auth/data-mini', 'GET').then((data) => {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));

      return this.getCompanyR();
    }).then((company) => {
      this.user.company = company;
      app.trigger('userLoaded', this.user);
    }).fail((xhr, status) => {
      localStorage.removeItem('token');
      app.defaultSaveActions.error(app, xhr, status, '');
    });
  }

  is_anonymous() {
    return !this.token;
  }

  get_full_name() {
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  toJSON() {
    return this.user;
  }

  getRoleInfo() {
    let role = this.user.role;
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

  getFormcR() {
    return this.formc ? '' : app.makeCacheRequest(authServer + '/user/formc');
  }

  getFormc() {
    return this.formc;
  }

}

module.exports = () => {
  return new User();
};