const SUPPORTED_NETWORKS = [
  'facebook',
  'linkedin',
  'google'
];

const SCOPES = {
  facebook: 'public_profile,email',
  linkedin: 'r_basicprofile,r_emailaddress,w_share',
  google: 'profile,email',
};

let hello = null;
const initLibrary = () => {
  return new Promise((resolve, reject) => {
    require.ensure(['hellojs'], (require) => {
      if (hello)
        return resolve();

      hello = require('hellojs');
      hello.init({
        facebook: app.config.facebookClientId,
        google: app.config.googleClientId,
        linkedin: app.config.linkedinClientId,
      }, {
        redirect_uri: '/account/finish/login/',
        oauth_proxy: app.config.authServer+'/proxy/'
      });

      resolve();
    }, 'hellojs_chunk');
  });
};

let functions = {

  // resolves when successful
  // resolves with `true` when canceled
  // rejects with error message otherwise
  login(network) {
    return initLibrary().then(() => {
      return new Promise((resolve, reject) => {
        if (!_.contains(SUPPORTED_NETWORKS, network))
          return reject(`Network ${network} is not supported`);

        console.log(`${network} logging in ...`);
        hello(network).login({
          scope: SCOPES[network],
        }).then((data) => {
          return this.sendToken(network, data.authResponse.access_token);
        }).then((data) => {
          return resolve({
            cancelled: false,
            data: data
          });
        }).then(null, (data) => {
          console.log(`${network} error`);
          console.log(data);

          if (_.isBoolean(data))
            return reject(`Authentication with ${network} account failed.`);

          if (data.error.code == 'cancelled')
            return resolve({
              cancelled: true,
              data: {}
            });

          return reject(data.error.message || `Authentication with ${network} account failed.`);
        });
      });
    });
  },

  sendToken(network, token) {
    return $.ajax({
      method: 'POST',
      url: `${app.config.authServer}/rest-auth/${network}/`,
      data: { access_token: token, domain: window.location.host },
    });
  },

  _ensureAgreedWithRules(view) {
    let data = {};
    let cb = view.el.querySelector('#agree-rules');

    if (cb.checked)
      data.checkbox1 = cb.value;

    const fields = view.fieldsSchema || view.fields;
    
    if (!app.validation.validate({ checkbox1: fields.checkbox1 }, data, this)) {
      _(app.validation.errors).each((errors, key) => {
        app.validation.invalidMsg(view, key, errors);
      });

      return false;
    }

    return true;
  },

  loginWithSocialNetwork(e) {
    e.preventDefault();

    if (!functions._ensureAgreedWithRules(this)) {
      return false;
    }

    const network = $(e.target).closest('.btn-social-network').data('network');

    app.showLoading();
    functions.login(network).then((data) => {
      if (data.cancelled) {
        app.hideLoading();
        return;
      }

      app.user.setData(data.data);

      $('#sign_up').modal('hide');
      $('#sign_in').modal('hide');
    }, (err) => {
      app.hideLoading();
      app.dialogs.error(err);
    });

    return false;
  }
};

module.exports = functions;
