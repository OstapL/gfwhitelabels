module.exports = {
  routes: {
    '': 'mainPage',
    'pg/:name': 'pagePG',
  },
  methods: {
    mainPage(id) {
      const model = require('components/campaign/models.js');
      const template = require('templates/mainPage.pug');
      const campaigns = new model.collection();

      //TODO: it looks like repeated snippet
      const meta = '<meta name="keywords" content="local investing equity crowdfunding ' +
        'GrowthFountain is changing equity crowdfunding for small businesses. Focused on ' +
        'local investing, they give a whole new meaning to finding investment."></meta>';
      $(document.head).append(meta);
      api.makeCacheRequest(raiseCapitalServer + '?limit=6').then((data) => {
        var html = template({
          collection: data,
          Urls: Urls,
        });

        // app.cache[window.location.pathname] = html;

        $('#content').html(html);

        $('.carousel-test').owlCarousel({
          loop: true,
          nav: false,
          autoplay: true,
          autoplayTimeout: 9000,
          smartSpeed: 2000,
          responsiveClass: true,
          animateOut: 'fadeOuts',
          items: 1,
          navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          ],
          responsive: {
            0: { items: 1 },
            600: { items: 1 },
            1000: { items: 1 },
          },
        });

        $('body').scrollTo();
        app.hideLoading();
      });
    },

    pagePG: function (name) {
      //TODO: move this to common router ensure logged in
      if ((name == 'success_guide' || name == 'advertising') &&
          !app.user.ensureLoggedIn(window.location.pathname)) {
        return false;
      }

      if (window.location.pathname == '/pg/faq') {
        const meta = '<meta name="keywords" content="local investing equity crowdfunding Have a ' +
          'question about local investing? Interested in equity crowdfunding but unsure how it ' +
          'works? Then visit our FAQ page to learn more."></meta>';
        $(document.head).append(meta);
      } else {
        const meta = '<meta name="keywords" content="local investing equity crowdfunding ' +
          'GrowthFountain is changing equity crowdfunding for small businesses. Focused on local ' +
          'investing, they give a whole new meaning to finding investment."></meta>';
        $(document.head).append(meta);
      }

      let view = require('templates/' + name + '.pug');
      $('#content').html(view({
          Urls: Urls,
          serverUrl: serverUrl,
        })
      );

      $('body').scrollTo();
      app.hideLoading();

      $('.show-input').on('click', function (event) {
        event.preventDefault();
        if ($(event.target).hasClass('noactive')) {
          return false;
        }

        let $this = $(event.target);
        let inputId = $this.data('name');
        let $input = $('input' + '#' + inputId);

        $this.hide();

        if ($input.length == 0) {
          const input  = '<input type="text" id="' + inputId + '" ' +
            'name="' + inputId + '" class="text-input"/>';
          $input = $(input);
          $this.after($input);
        }

        $input.fadeIn().focus();
      });

      $('body').on('focusout', '.text-input', (event) => {
        let $this = $(event.target);
        let value = $this.val();
        let inputId = $this.attr('id');
        let $span = $('[data-name="' + inputId + '"]');

        if (value !== '') {
          $span.text(value);
        }

        $this.hide();
        $span.fadeIn();
      });
      const names = ['education',
        'terms_of_use',
        'privacy_policy',
        'advertising',
        'formc_review_first',
      ];
      if (names.indexOf(name) != -1) {
        require('components/sticky-kit/js/sticky-kit.js');
        $('.sticky-side-menu').stick_in_parent()
        .on('sticky_kit:bottom', function (e) {
          $(this).parent().css('position', 'static');
        })
        .on('sticky_kit:unbottom', function (e) {
          $(this).parent().css('position', 'relative');
        });
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
          $elem.closest('.custom-accordion')
          .find('.list-group-item-action')
          .removeClass('active')
          .find('.fa')
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');
          $icon.removeClass('fa-angle-down')
          .addClass('fa-angle-up');
        }

        $elem.toggleClass('active');
      });

    },
  },
};
