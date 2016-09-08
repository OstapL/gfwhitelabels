module.exports = Backbone.Router.extend({
    routes: {
        '': 'mainPage',
        'pg/:name': 'pagePG',
    },

    mainPage(id) {
        require.ensure([], () => {
            const model = require('components/campaign/models.js');
            const template = require('templates/mainPage.pug');

            app.collections.campaigns = new model.collection();
            app.collections.campaigns.fetch({
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
        });
    },
});
