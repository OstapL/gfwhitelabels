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
    return new Promise((resolve, reject) => {
      if (!SUPPORTED_NETWORKS.includes(network))
        return reject(`${network} is not supported`);

      initLibrary().then(() => {
        console.log(`Logging in via ${network}`);

        hello(network).login({
          scope: SCOPES[network],
        }).then((data) => {
          return this.sendToken(network, data.authResponse.access_token);
        }).then((data) => {
          return resolve({
            cancelled: false,
            data,
          });
        }).then(null, (data) => {
          const error = `Failed to log in via ${network}`;

          console.log(error);
          console.log(data);

          if (typeof(data) === 'boolean')
            return reject(error);

          if (data.error.code === 'cancelled')
            return resolve({
              cancelled: true,
              data: {},
            });

          return reject(data.error.message || error);
        });
      }).catch(reject);
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
      Object.keys(app.validation.errors).forEach((key) => {
        const errors = app.validation.errors[key];
        app.validation.invalidMsg(view, key, errors);
      });
      return false;
    }

    return true;
  },

  loginWithSocialNetwork(network) {
    app.showLoading();
    return new Promise((resolve) => {
      functions.login(network).then((data) => {
        if (data.cancelled) {
          app.hideLoading();
          return resolve(false);
        }

        return resolve(data.data);
      }, (err) => {
        app.hideLoading();
        app.dialogs.error(err);
        resolve(false);
      });
    });
  },

  signupWithSocialNetwork(network) {
    if (!functions._ensureAgreedWithRules(this))
      return Promise.resolve(false);

    return functions.loginWithSocialNetwork.call(this, network);
  },
};

module.exports = functions;
