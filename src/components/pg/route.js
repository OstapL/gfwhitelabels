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
          api.makeCacheRequest(raiseCapitalUrl + '?limit=6').then((data) => {
            var html = template({
                companies: data.data,
                Urls: Urls,
            });
            app.cache[window.location.pathname] = html;
            $('#content').html(html);
            $('body').scrollTo();
            app.hideLoading();
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
              event.preventDefault();
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
            if (['education', 'terms_of_use', 'privacy_policy','formc_review_first'].indexOf(name) != -1) {
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
                $('.sticky-side-menu').stick_in_parent()
                .on('sticky_kit:bottom', function(e) {
                    $(this).parent().css('position', 'static');
                })
                .on('sticky_kit:unbottom', function(e) {
                    $(this).parent().css('position', 'relative');
                })
            }

            let $content = $('#content');

            $content.find('.list-group-item-action').click(function (e) {
              $content.find('.list-group-item-action').removeClass('active');
              $content.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

              let $elem = $(e.target);
              let $icon = $elem.find('.fa');

              if ($elem.is('.active')) {
                $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
              } else {
                // remove active state of all other panels
                $elem.closest('.custom-accordion').find('.list-group-item-action').removeClass('active')
                  .find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
                  $icon.removeClass('fa-angle-down').addClass('fa-angle-up');
              }
              $elem.toggleClass('active');
            });
        });
    },
});
