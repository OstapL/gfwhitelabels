"use strict";
let hello = require('hellojs');
hello.init({
    facebook: facebookClientId,
    google: googleClientId,
    linkedin: linkedinClientId, 
}, {
    redirect_uri: '/account/finish/login/',
    oauth_proxy: formcServer+'/proxy/'
});

var helloApp = {
    sendToken: function (network, token) {
        console.log('sendToken');
        return $.ajax({
            method: 'POST',
            url: formcServer+'/rest-auth/'+network+'/',
            data: {access_token: token},
        });
    }
}

module.exports = helloApp
