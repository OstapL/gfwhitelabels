let hello = require('hellojs');
hello.init({
    facebook: facebookClientId,
    google: googleClientId,
    linkedin: linkedinClientId, 
}, {
    redirect_uri: '/account/finish/login/',
    oauth_proxy: '/proxy/'
});

var helloApp = {
    send: function (network, token) {
        console.log('sendToken');
        $.ajax({
            method: 'POST',
            url: serverUrl+'/rest-auth/'+network+'/',
            data: {access_token: token},
            success: function(result,status,xhr) {
              alert("success facebook-auth =), here must be redirect");
            },
            fail: function(result,status,xhr) {
              console.log(result,status,xhr);  
            }
        });
    },
    onFacebookLogin: function (e) {
        console.log('onFacebookLogin');
        this.send('facebook', e.authResponse.access_token);
    },
    onFacebookFail: function (e) {
        console.log('onFacebookLogin');
    },
    onGoogleLogin: function (e) {
        console.log('onGoogleLogin');
        this.send('google', e.authResponse.access_token);
    },
    onGoogleFail: function (e) {
        console.log('onGoogleFail');
        console.log(e);
    },
    onLinkedInLogin: function (e) {
        console.log('onLinkedInLogin');
        this.send('linkedin', e.authResponse.access_token);
    },
    onLinkedInFail: function (e) {
        console.log('onLinkedInFail');
        console.log(e);
    }
}

module.exports = helloApp
