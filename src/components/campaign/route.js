// Polyfill webpack require.ensure.
if (typeof require.ensure !== `function`) require.ensure = (d, c) => c(require);    

module.exports = Backbone.Router.extend({
  routes: {
    ':id/invest_thanks': 'investmentThankYou',
    'companies': 'list',
    ':id': 'detail',
    ':id/invest': 'investment',
  },

  investmentThankYou(id) {
    require.ensure([], () => {
      const View = require('./views.js');
      let i = new View.investmentThankYou({
        el: '#content',
        model: {
          id: 19,
          amount: 10000,
          transaction_id: '1234567',
          amount_of_shares: 123,
          perk: 'Perk Content',
          security: 'Investment Terms Content'
        },
        company: {
          id: 78,
          name: 'Company Name',
        },
      });
      i.render();
      app.hideLoading();
      // const a1 = api.makeCacheRequest(investmentServer + '/' + id).then((data) => {

      // });
    });
  },

  list() {
    require.ensure([], () => {
      const View = require('./views.js');

      let params = '?limit=6';
      let page = parseInt(app.getParams().page);
      let offset = ((page > 0) ? page : 1) - 1;
      if (offset) params += '&offset=' + (offset * 6);
      api.makeCacheRequest(raiseCapitalServer + params).then((data) => {
        let i = new View.list({
          el: '#content',
          collection: data.data,
        });
        $('body').scrollTo();
        i.render();
        app.hideLoading();
      });

    });
  },

  detail(id) {
    require.ensure([], () => {
      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalServer + "/" + id).
        then((modelData) => {
          let i = new View.detail({
            el: '#content',
            model: modelData,
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
    require.ensure([], () => {
      if (!app.user.is_anonymous()) {
        const View = require('./views.js');

        const a1 = api.makeCacheRequest(investmentServer + '/', 'OPTIONS');
        const a2 = api.makeCacheRequest(raiseCapitalServer + '/' + id);
        const a3 = api.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(a1, a2, a3).
          then((investmentMeta, companyData, userData) => {
            // investmentMeta = [
            //   {
            //     fields: {
            //       amount: { type: 'int', required: true},
            //       first_name: { type: 'str', required: true},
            //       last_name: { type: 'str', required: true},
            //       country: { type: 'choice', required: true},
            //       address1: { type: 'str', required: true},
            //       address2: { type: 'str', required: false},
            //       zip_code: { type: 'str', required: true},
            //       city: { type: 'str', required: true},
            //       state: { type: 'str', required: true},
            //       payment_method: { type: 'str', required: true},
            //       name_on_bank_account: { type: 'str', required: true},
            //       account_number_re: { type: 'str', required: true},
            //       route_number: { type: 'str', required: true},
            //       bank_account_type: { type: 'str', required: true},
            //     }
            //   }
            // ];
            // companyData = [
            //   {
            //     id: 1,
            //     name: 'N!CE',
            //     campaign: {
            //       perks: [],
            //     }
            //   }
            // ]
            const i = new View.investment({
              el: '#content',
                model: companyData[0],
                fields: investmentMeta[0].fields,
                user: userData[0],
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

        if (!window.pdfMake) {
          ['/js/pdfmake.js', '/js/vfs_fonts.js'].forEach( (uri) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = uri;
            $('head').append(script);
          });
        }
    });
  },
});
