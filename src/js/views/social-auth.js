let hello = require('hellojs');
hello.init({
    facebook: '547857385398592',
    google: '329026937492-pkmge3at186jvjn14mep9vpa4fk3gqpg.apps.googleusercontent.com',
    linkedin: '77hgtbs9rkjk20', 
}, {
    redirect_uri: '/',
    oauth_proxy: '/proxy/'
});

var helloApp = {
    send: function (network, token) {
        console.log('sendToken');
        $.ajax({
            method: 'POST',
            url: '/rest-auth/'+network+'/',
            data: {access_token: token},
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            success: function(result,status,xhr) {
              alert("success facebook-auth =), here must be redirect");
            }
        });
    },
    onFacebookLogin: function (e) {
        console.log('onFacebookLogin');
        sendToken('facebook', e.authResponse.access_token);
    },
    onFacebookFail: function (e) {
        console.log('onFacebookLogin');
    },
    onGoogleLogin: function (e) {
        console.log('onGoogleLogin');
        sendToken('google', e.authResponse.access_token);
    },
    onGoogleFail: function (e) {
        console.log('onGoogleFail');
        console.log(e);
    },
    onLinkedInLogin: function (e) {
        console.log('onLinkedInLogin');
        sendToken('linkedin', e.authResponse.access_token);
    },
    onLinkedInFail: function (e) {
        console.log('onLinkedInFail');
        console.log(e);
    }
}

module.export = helloApp
