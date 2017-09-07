const templateMap = {
  'annual-privacy': 'annual_privacy',
  'investor-tutorial': 'investor_tutorial',
  'business-tutorial': 'business_tutorial',
  'success-guide': 'success_guide',
  'terms-of-use': 'terms_of_use',
  'privacy-policy': 'privacy_policy',
  'electronic-signature': 'electronic_signature',
  'formc-review-congratulations': 'formc_review_congratulations',
};

const withLeftMenuPages = ['education', 'advertising', 'terms-of-use', 'privacy-policy'];

module.exports = {
  routes: {
    '': 'mainPage',
    'pg/:name': 'pagePG',
    'subscription-thanks': 'subscriptionThanks',
  },
  methods: {
    mainPage() {
      require.ensure([], (require) => {
        const Views = require('src/components/pg/views.js');

        api.makeCacheRequest(app.config.raiseCapitalServer + '?limit=6').then((data) => {
          data.data = data.data.map(c => new app.models.Company(c));
          app.currentView = new Views.main({ collection: data, });
          app.currentView.render();
          $('body').scrollTo();
          app.hideLoading();
        });
      }, 'main_page_chunk');
    },

    pagePG: function (name) {

      require.ensure([], (require) => {
        //TODO: move this to common router ensure logged in
        if ((name == 'success-guide' || name == 'advertising') &&
          !app.user.ensureLoggedIn(window.location.pathname)) {
          return false;
        }

        app.addClassesTo('#page', [name]);
        const template = require('./templates/' + (templateMap[name] || name) + '.pug');
        if (withLeftMenuPages.includes(name)) {
          const Views = require('./views.js');
          app.currentView = new Views.WithLeftMenu({
            template,
          });
          app.currentView.render();
        } else {
          $('#content').html(template());
        }

        // investor and busines tutorial
        $('.carousel-tutorial').owlCarousel({
            loop: true,
            nav: true,
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

        var owl = $('.owl-carousel');
        owl.owlCarousel();
        $('.customNextBtn').click(function() {
          owl.trigger('next.owl.carousel');
        });

        $('body').scrollTo();
        app.hideLoading();

        $(window).scroll(function() {
          var st = $(this).scrollTop() /15;

            $(".scroll-paralax .background").css({
              "transform" : "translate3d(0px, " + st /2 + "%, .01px)",
              "-o-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
              "-webkit-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
              "-moz-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
              "-ms-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
          });
        });

        // pause for modal on page news
        $('#audio-modal').on('hidden.bs.modal', function (e) {
            document.getElementById('news_audio').pause()
        });

        const names = ['education',
          'terms-of-use',
          'privacy-policy',
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
      }, 'pg_chunk');
    },

    subscriptionThanks() {
      const pageType = {
        urgent: '1',
      };

      require.ensure([], (require) => {
        const Views = require('./views.js');

        const template = app.getParams().type == pageType.urgent
          ? require('./templates/subscription-thanks-urgent.pug')
          : require('./templates/subscription-thanks.pug');

        app.currentView = new Views.subscriptionThanks({ template });
        app.currentView.render();

        $('body').scrollTo();
        app.hideLoading();
      }, 'pg_chunk');
    },

  },
};
