// Polyfill webpack require.ensure.
if (typeof require.ensure !== `function`) require.ensure = (d, c) => c(require);    

const helpers = require('./helpers.js');

module.exports = Backbone.Router.extend({
  routes: {
    ':id/invest-thanks': 'investmentThankYou',
    'companies': 'list',
    ':id': 'detail',
    ':id/invest': 'investment',
  },

  execute: function (callback, args, name) {
    if (callback)
      callback.apply(this, args);
    else
      alert('Not such url');
  },

  investmentThankYou(id) {
    if (!app.user.ensureLoggedIn(window.location.pathname))
      return false;

    require.ensure([], () => {
      api.makeRequest(investmentServer + '/' + id).done((data) => {
        data.id = id;
        const View = require('./views.js');
        let i = new View.investmentThankYou({
          model: data,
        });
        i.render();
        app.hideLoading();
      });
    });
  },

  list() {
    require.ensure([], () => {
      const View = require('./views.js');

      let params = '?limit=6';
      let page = parseInt(app.getParams().page);
      let offset = ((page > 0) ? page : 1) - 1;
      if (offset) params += '&offset=' + (offset * 6);
      let orderBy = app.getParams().orderby;
      if (orderBy) params += '&orderby=' + orderBy;
      api.makeCacheRequest(raiseCapitalServer + params).then((data) => {
        let i = new View.list({
          el: '#content',
          collection: data,
        });
        $('body').scrollTo();
        i.render();
        app.hideLoading();
      });

    });
    $(document.head).append('<meta name="keywords" content="local investing equity crowdfunding GrowthFountain is focused on local investing. Find the perfect fit for your investment with our equity crowdfunding setup by clicking here."></meta>');
  },

  detail(id) {
    require.ensure([], () => {

      if(helpers.slugs[id]) {
        id = helpers.slugs[id];
      }

      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalServer + "/" + id).
        then((companyData) => {
          let i = new View.detail({
            model: companyData,
          });
          i.render();
          if(location.hash && $(location.hash).length) {
              setTimeout(function(){$(location.hash).scrollTo(65);}, 100);
          } else {
              $('#content').scrollTo();
          }
          app.hideLoading();
      });
    })
  },

  investment(id) {
    if (!app.user.ensureLoggedIn(window.location.pathname))
      return false;

    require.ensure([], () => {
      if (!app.user.is_anonymous()) {
        const View = require('./views.js');
        let investmentR = api.makeCacheRequest(investmentServer + '/', 'OPTIONS');
        let companyR = api.makeCacheRequest(raiseCapitalServer + '/' + id);
        let userR = api.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(investmentR, companyR, userR).done((investmentMeta, companyData, userData) => {
            const i = new View.investment({
              model: companyData[0],
              user: userData[0],
              fields: investmentMeta[0].fields,
            });
            i.render();
            $('#content').scrollTo();
            app.hideLoading();
          })
        } else {
          app.routers.navigate(
            '/account/login', {trigger: true, replace: true}
          );
        }

        // if (!window.pdfMake) {
        //   ['/js/pdfmake.js', '/js/vfs_fonts.js'].forEach( (uri) => {
        //     let script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     script.src = uri;
        //     $('head').append(script);
        //   });
        // }
    });
  },
});
