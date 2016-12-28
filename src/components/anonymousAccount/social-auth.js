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

var helloApp = {
    sendToken: function (network, token) {
        console.log('sendToken');
        return $.ajax({
            method: 'POST',
            url: authServer+'/rest-auth/'+network+'/',
            data: {access_token: token, domain: window.location.host},
        });
    }
}

module.exports = helloApp
