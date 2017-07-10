const Image = require('models/image.js');
const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

const fixImageData = (data) => {
  if (data.image_data == null ||
      !Array.isArray(data.image_data)) {
    return data;
  }

  if(data.image_data.length == 0) {
    data.image_data = {};
    return data;
  }

  let originData = data.image_data[0];
  let croppedData = data.image_data[1] || originData;

  data.image_data = originData;
  data.image_data.urls = {
    origin: originData.urls ? (originData.urls[0] || '') : '',
    main: croppedData.urls ? (croppedData.urls[0] || '') : '',
    '50x50': croppedData.urls ? (croppedData.urls[0] || '') : '',
  }

  return data;
};

class User {
  constructor() {
    this.company = null;
    this.campaign = null;
    this.formc = null;

    this.data = { token: '', id: ''};
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

  setFormcPaid(formcID) {
    if (this.companiesMember.length <= 0)
      return;

    if (this.formc.id === formcID)
      this.formc.is_paid = true;

    const companyInfo = _.find(this.companiesMember, companyInfo => companyInfo.formc_id === formcID);
    if (companyInfo)
      companyInfo.is_paid = true;
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

    if(data.hasOwnProperty('token')) {
      let a = '';
      if(data.hasOwnProperty('info') == false) {
        a = api.makeRequest(app.config.authServer + '/info',  'GET'); //.done(() => {
      }
      $.when(a).done((responseData) => {
        if(responseData) {
          // we need to rerender menu
          this.data = responseData;
        } else {
          this.data = data;
        }
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
      }).fail(() => {
        this.emptyLocalStorage();
        setTimeout(function() {
          window.location = '/account/login?next=' + document.location.pathname;
        }, 100);
      });
    } else {
      app.dialogs.error('no token or additional info provided');
    }
  }

  updateUserData(data, next) {
    const infoRequest = data.info ? null : api.makeRequest(app.config.authServer + '/info',  'GET');
    $.when(infoRequest).done((responseData) => {
      this.data = _.extend({}, this.data, responseData || data);
      this.data.image_image_id = new app.models.Image(
        app.config.authServer + '/rest-auth/data',
        data.image_data
      );
      this.updateLocalStorage();
      app.profile.render();
      delete data.token;
      if (next)
        setTimeout(() => window.location = next, 100);
    }).fail(() => {
      this.emptyLocalStorage();
      setTimeout(function() {
        window.location = '/account/login?next=' + document.location.pathname;
      }, 100);
    });
  }

  emptyLocalStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    app.cookies.expire('token');
    this.token = null;
    this.data = {};
  }

  loadWithPromise() {
    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      if (this.token === null)
        return resolve();

       const data = fixImageData(JSON.parse(localStorage.getItem('user')) || {});
      //ensure user has all required data.info
      let infoReq = !data.info || !Array.isArray(data.info)
        ? api.makeRequest(app.config.authServer + '/info',  'GET')
        : null;

      $.when(infoReq).then((responseData) => {
        this.data = responseData || data;
        this.data.image_image_id = new Image(
          app.config.authServer + '/rest-auth/data',
          data.image_data || {}
        );
        if (responseData) {
          this.updateLocalStorage();
        }
        return resolve()
      }).fail(() => {
        this.emptyLocalStorage();
        setTimeout(() => {
          window.location = '/account/login?next=' + document.location.pathname;
        }, 100);
        return resolve();
      });
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

  getRoles() {
    if (!this.companiesMember || !this.companiesMember.length)
      return [];

    const role_data = [];

    _.each(this.companiesMember, (data) => {
      let roles = app.helpers.role.extractRoles(data.role);
      role_data.push({
        company: {
          id: data.company_id,
          name: data.company,
          is_paid: data.is_paid,
        },
        roles: roles,
      });
    });

    return role_data;
  }

  getRolesInCompany(company_id) {
    if (!_.isNumber(company_id)) {
      return;
    }

    const role_data = this.getRoles();

    return _(role_data).find((data) => { return data.company.id == company_id; });
  }

  ensureLoggedIn(next) {
    if (!this.is_anonymous()) {
      return true;
    }

    this.next = next || (window.location.pathname + window.location.search);
    require.ensure(['components/anonymousAccount/views.js'], (require) => {
      const pView = require('components/anonymousAccount/views.js');

      let v = $('#content').is(':empty')
        ? new pView.signup({
          el: '#content',
          model: {},
        })
        : new pView.popupLogin({});

      v.render();
      app.hideLoading();
    }, 'anonymous_account_chunk');

    return false;
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
