// Polyfill webpack require.ensure.
if (typeof require.ensure !== `function`) require.ensure = (d, c) => c(require);    

module.exports = Backbone.Router.extend({
  routes: {
    'api/campaign': 'list',
    'api/campaign/:id': 'detail',
    'api/campaign/:id/invest': 'investment',
  },

  list() {
    require.ensure([], () => {
      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalServer).then((data) => {
        let i = new View.list({
          el: '#content',
          collection: data.data,
        });
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

        const a1 = null; //api.makeCacheRequest(investmentServer + '/', 'OPTIONS');
        const a2 = null; //api.makeCacheRequest(raiseCapitalServer + '/' + id);

        $.when(a1, a2).
          then((investmentMeta, companyData) => {
            investmentMeta = [
              {
                fields: {
                  amount: { type: 'int', required: true},
                  first_name: { type: 'str', required: true},
                  last_name: { type: 'str', required: true},
                  country: { type: 'choice', required: true},
                  address1: { type: 'str', required: true},
                  address2: { type: 'str', required: false},
                  zip_code: { type: 'str', required: true},
                  city: { type: 'str', required: true},
                  state: { type: 'str', required: true},
                  payment_method: { type: 'str', required: true},
                  name_on_bank_account: { type: 'str', required: true},
                  account_number_re: { type: 'str', required: true},
                  route_number: { type: 'str', required: true},
                  bank_account_type: { type: 'str', required: true},
                }
              }
            ];
            companyData = [
              {
                id: 1,
                name: 'N!CE',
                campaign: {
                  perks: [],
                }
              }
            ]
            const i = new View.investment({
              el: '#content',
                model: companyData[0],
                fields: investmentMeta[0].fields
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
    });
  },
});
