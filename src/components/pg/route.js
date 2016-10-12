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
            $('.show-input').on('click', function(event) {
              if ($(event.target).hasClass('noactive')) {
                  return false;
                }

                var $this = $(event.target),
                  inputId = $this.data('name'),
                  $input = $('input' + '#' + inputId);

                $this.hide();

                if ($input.length == 0) {
                  $input = $('<input type="text" id="' + inputId + '" name="' + inputId + '" class="text-input"/>');
                  $this.after($input);
                }

                $input.fadeIn().focus();
            });

            $('body').on('focusout', '.text-input', function(event) {
                var $this = $(event.target),
                    value = $this.val(),
                    inputId = $this.attr('id'),
                    $span = $('[data-name="' + inputId + '"]');

                if (value !== '') {
                    $span.text(value);
                }

                $this.hide();
                $span.fadeIn();
            });
            if (['education', 'terms_of_use', 'privacy_policy'].indexOf(name) != -1) {
                require('components/sticky-kit/js/sticky-kit.js');
                $('.sticky-side-menu').stick_in_parent()
                .on('sticky_kit:bottom', function(e) {
                    $(this).parent().css('position', 'static');
                })
                .on('sticky_kit:unbottom', function(e) {
                    $(this).parent().css('position', 'relative');
                })
            }
        });
    },
});
