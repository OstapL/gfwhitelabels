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

            /*if (name === 'education') {
                debugger
                setTimeout(() => {
                    var stickyToggle = function(sticky, stickyWrapper, scrollElement) {
                      var stickyHeight = sticky.outerHeight();
                      var stickyTop = stickyWrapper.offset().top;
                      if (scrollElement.scrollTop() >= stickyTop){
                        stickyWrapper.height(stickyHeight);
                        sticky.addClass("is-sticky");
                      }
                      else{
                        sticky.removeClass("is-sticky");
                        stickyWrapper.height('auto');
                      }
                    };

                    $('[data-toggle="sticky-onscroll"]').each(function() {
                      var sticky = $(this);
                      var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
                      sticky.before(stickyWrapper);
                      sticky.addClass('sticky');

                      // Scroll & resize events
                      $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function() {
                        stickyToggle(sticky, stickyWrapper, $(this));
                      });

                      // On page load
                      stickyToggle(sticky, stickyWrapper, $(window));
                    });

                  }, 100);
            }*/
        });
    },
});
