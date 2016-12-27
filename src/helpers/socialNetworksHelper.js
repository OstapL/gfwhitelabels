module.exports = {
  init() {
    this.facebook._init();
    this.googlePlus._init();
  },

  facebook: {
    _init() {
      window.fbAsyncInit = function() {
        FB.init({
          appId: facebookClientId,
          xfbml      : true,
          version    : 'v2.7'
        });
      };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },

    share(data) {
      FB.ui(_.extend({
        method: 'share',
      }, data), (response) => {});
    },
  },

  googlePlus: {
    _init() {

    },

    share(data) {
      window.open(encodeURI(`https://plus.google.com/share?url=${data.href}`), 'Growth Fountain Campaign', 'width=550, height=420');
    },
  },

  twitter: {
    share(data) {
      window.open(encodeURI(`https://twitter.com/share?url=${data.href}
        &via=growthfountain
        &hashtags=${data.hashtags.join(',')}
        &text=${data.text}`),'Growth Fountain Campaign','width=550,height=420');
    },
  },

  linkedIn: {
    share(data) {
      window.open(encodeURI(`https://www.linkedin.com/shareArticle?mini=true&url=${data.href}
        '&title=${data.title}
        '&summary=${data.description}
        '&source=Growth Fountain`),'Growth Fountain Campaign','width=605,height=545');
    },
  },

  email: {
    share(data) {
      window.open("mailto:?subject=" + data.subject + "&body=" + data.message + "%0D%0A" + data.href);
    }
  },

};