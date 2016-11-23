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
      const Model = require('./models.js');
      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalUrl).then((data) => {
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

      api.makeCacheRequest(raiseCapitalUrl + "/" + id).
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
        const Model = require('./models.js');
        //const investModel = require('../investment/models.js');
        const View = require('./views.js');

        var a1 = api.makeCacheRequest(Urls['investment-list'](), 'OPTIONS');
        var a2 = api.makeCacheRequest(Urls['campaign-detail'](id));

        $.when(a1, a2).
          then((metaData, campaignModel) => {
            console.log(metaData, campaignModel);
            var i = new View.investment({
              el: '#content',
                campaignModel: new Model.model(campaignModel[0]),
                fields: metaData[0].actions.POST
            });
            i.render();
            //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
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
