"use strict";
let hello = require('hellojs');

hello.init({
    facebook: facebookClientId,
    google: googleClientId,
    linkedin: linkedinClientId, 
}, {
    redirect_uri: '/account/finish/login/',
    oauth_proxy: authServer+'/proxy/'
});

const SUPPORTED_NETWORKS = ['facebook', 'linkedin', 'google'];
const SCOPES = {
  facebook: 'public_profile,email',
  linkedin: 'r_basicprofile,r_emailaddress,w_share',
  google: 'profile,email',
};

module.exports = {

  // resolves when successful
  // resolves with `true` when canceled
  // rejects with error message otherwise
  login(network) {
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
  },

  sendToken(network, token) {
    return $.ajax({
      method: 'POST',
      url: `${authServer}/rest-auth/${network}/`,
      data: { access_token: token, domain: window.location.host },
    });
  },
};
