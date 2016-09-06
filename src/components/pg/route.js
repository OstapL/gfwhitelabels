module.exports = Backbone.Router.extend({
    routes: {
        '': 'mainPage',
        'pg/:name': 'pagePG',
    },

    mainPage(id) {
        require.ensure([], () => {
            const template = require('templates/mainPage.pug');
            app.cache[window.location.pathname] = template();
            $('#content').html(template());
            app.hideLoading();
        });
    },

    pagePG: function(name) {
        require.ensure([], () => {
            const view = require('templates/' + name + '.pug');
            $('#content').html(view({
                    Urls: Urls,
                    serverUrl: serverUrl
                })
            );
            app.hideLoading();
        });
    },
});
