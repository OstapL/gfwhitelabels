module.exports = Backbone.Router.extend({
    routes: {
        '': 'mainPage',
        'pg/:name': 'pagePG',
    },

    mainPage(id) {
        require.ensure([], () => {
            const model = require('components/campaign/models.js');
            const template = require('templates/mainPage.pug');

            const campaigns = new model.collection();
            campaigns.fetch({
                data: {limit: 6},
                success: (collection, response, options) => {
                    var html = template({
                        campaigns: collection.toJSON(),
                        collection: collection,
                        Urls: Urls,
                    });
                    app.cache[window.location.pathname] = html;
                    $('#content').html(html);
                    $('body').scrollTo();
                    app.hideLoading();
                }
            });

        });
    },

    pagePG: function(name) {
        require.ensure([], () => {
            let view = require('templates/' + name + '.pug');
            $('#content').html(view({
                    Urls: Urls,
                    serverUrl: serverUrl
                })
            );
            $('body').scrollTo();
            app.hideLoading();
            if (['education', 'terms_of_use', 'privacy_policy'].indexOf(name) != -1) {
              require('components/sticky-kit/js/sticky-kit.js');
              $('.sticky-side-menu').stick_in_parent();
            }
        });
    },
});
