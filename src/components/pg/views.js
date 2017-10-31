const withLeftMenuPages = ['education', 'advertising', 'terms-of-use', 'privacy-policy'];
const templateMap = {
  'annual-privacy': 'annual_privacy',
  'investor-tutorial': 'investor_tutorial',
  'business-tutorial': 'business_tutorial',
  'success-guide': 'success_guide',
  'terms-of-use': 'terms_of_use',
  'privacy-policy': 'privacy_policy',
  'electronic-signature': 'electronic_signature',
  'formc-review-congratulations': 'formc_review_congratulations',
  'investor-questions': 'investorquestions',
  'entrepreneur-questions': 'entrepreneurquestions',
  'heartland-tour': 'heartland-tour',
};

function scaleVideoContainer(selector='.homepage-hero-module') {
  const height = $(window).height() + 5;
  const unitHeight = parseInt(height) + 'px';
  $(selector).css('height', unitHeight);
};

function initBannerVideoSize(element){
  $(element).each(function() {
    const $this = $(this);
    $this.data('height', $this.height());
    $this.data('width', $this.width());
  });

  scaleBannerVideoSize(element);
};

function scaleBannerVideoSize(element){
  const $w = $(window);
  
  let windowWidth = $w.width(),
  windowHeight = $w.height() + 5,
  videoWidth,
  videoHeight;

    // console.log(windowHeight);

  $(element).each(function(){
    const $this = $(this);
    let videoAspectRatio = $this.data('height')/$this.data('width');

    $this.width(windowWidth);

    if(windowWidth < 1000) {
        videoHeight = windowHeight;
        videoWidth = videoHeight / videoAspectRatio;
        $this.css({'margin-top' : 0, 'margin-left' : (windowWidth - videoWidth) / 2 + 'px'});

        $this.width(videoWidth).height(videoHeight);
    }
    
    const $video = $('.homepage-hero-module .video-container video');

    if (!$video.hasClass('fadeIn'))
      $video.addClass('fadeIn');

    if (!$video.hasClass('animated')) 
      $video.addClass('animated');

  });
};

function resizeHandler() {
  scaleVideoContainer();
  scaleBannerVideoSize('.video-container .poster img');
  scaleBannerVideoSize('.video-container .filter');
  scaleBannerVideoSize('.video-container video');
};

const Views = {
  WithLeftMenu: Backbone.View.extend({
    el: '#content',

    initialize(options) {
      this.templateName = options.template;
      this.template = require(`./templates/${ this.templateName }.pug`);
      this.scrollHandler = null;
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      app.clearClasses('#page', ['page']);
      if (this.scrollHandler) {
        $(window).off('scroll', this.scrollHandler);
        this.scrollHandler = null;
      }
      if (this.$sideMenu) {
        //destroy sticky side menu
        this.$sideMenu.trigger("sticky_kit:detach");
        this.$sideMenu = null;
      }
    },

    render() {
      this.$el.html(
        this.template(
          this.model
        ),
      );
      this.initStickySideMenu();
      if (!this.scrollHandler) {
        this.scrollHandler = this.updateMenuOnScroll.bind(this);
        $(window).on('scroll', this.scrollHandler);
      }

      return this;
    },
    initStickySideMenu() {
      this.$sideMenu = this.$el.find('.sticky-side-menu');
      if (!this.$sideMenu || !this.$sideMenu.length)
        return;

      require('components/sticky-kit/js/sticky-kit.js');
      this.$sideMenu.stick_in_parent()
        .on('sticky_kit:bottom', function (e) {
          $(this).parent().css('position', 'static');
        })
        .on('sticky_kit:unbottom', function (e) {
          $(this).parent().css('position', 'relative');
        });
    },

    updateMenuOnScroll(e) {
      const leftMenu = this.el.querySelector('.pages-left-menu');
      if (!leftMenu)
        return;

      const menuItems = leftMenu.querySelectorAll('a');
      const visibleElements = [];

      (menuItems || []).forEach((menuItem) => {
        const href = menuItem.getAttribute('href');
        if (!href || !href.startsWith('#'))
          return;

        const element = document.getElementById(href.replace('#', ''));
        if (element && app.isElementInView(element))
          visibleElements.push(element);
      });

      const visibleTopmostElement = visibleElements ? visibleElements[0] : null;
      if (!visibleTopmostElement)
        return;

      (menuItems || []).forEach((menuItem) => {
        const href = menuItem.getAttribute('href').replace('#', '');
        const elementID = visibleTopmostElement.getAttribute('id');
        if (href=== elementID)
          menuItem.parentElement.classList.add('active');
        else
          menuItem.parentElement.classList.remove('active');
      });
    }
  }),

  subscriptionThanks: Backbone.View.extend({
    el: '#content',

    initialize(options) {
      this.template = options.template;
    },

    render() {
      this.$el.html(
        this.template()
      );
    },

  }),

  main: Backbone.View.extend({
    el: '#content',
    template: require('./templates/mainPage.pug'),
    initialize(options) {
      this.collection = options.collection;
      //TODO: universal optimization in scriptLoader
      app.helpers.video.preloadScripts(['vimeo']);
    },
    
    postRender() {
      this.$carousel = $('.carousel-test').owlCarousel({
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
      this.$carouselReview = $('.carousel-review').owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 9000,
        smartSpeed: 2000,
        responsiveClass: true,
        items: 3,
        navText: [
          '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          '<i class="fa fa-angle-right" aria-hidden="true"></i>',
        ],
        responsive: {
          0: { items: 1 },
          991: { items: 2 },
          1200: { items: 3 },
        },
      });
      this.attachEvents();
    },

    attachEvents() {
      if (!this.resizeHandler) {
        scaleVideoContainer();
        initBannerVideoSize('.video-container .poster img');
        initBannerVideoSize('.video-container .filter');
        initBannerVideoSize('.video-container video');

        $(window).on('resize', this.resizeHandler = resizeHandler);
      }
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      setTimeout(() => {
        if (this.$carousel) {
          this.$carousel.hide();
          this.$carousel.owlCarousel('destroy');
          this.$carousel = null;
        }
      }, 4000);

      if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
    },

    render() {
      this.$el.html(this.template({ collection: this.collection, }));
      this.$el.find('.calculator-block-click .calculator-item .text-wrap').equalHeights();
      setTimeout(() => {
        this.$el.find('.one-review .review-text').equalHeights();
      },1000);
      this.postRender();
      return this;
    },

  }),

  pg: Backbone.View.extend({
    el: '#content',
    events: {
      'click .list-group-item-action': 'accordeonHandler',
    },

    initCarousel() {
      this.$owlCarousel = this.$el.find('.owl-carousel');
      if (!this.$owlCarousel || !this.$owlCarousel.length)
        return;
      
      this.$owlCarousel.owlCarousel({
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
      this.$el.find('.customNextBtn').on('click', () => this.$owlCarousel.trigger('next.owl.carousel'));
    },

    initAudioModalEvents() {
      this.$audioModal = this.$el.find('#audio-modal');
      if (!this.$audioModal)
        return;
      
      this.$audioModal.on('hidden.bs.modal', () => {
        document.getElementById('news_audio').pause()
      });
    },

    initCalendly() {
      this.$calendly = this.$el.find('.calendly');
      if (!this.$calendly || !this.$calendly.length)
        return;
      app.helpers.scripts.loadCalendlyAPI().then(() => {
        this.$el.find('.scheduleCall').on('click', (e) => {
          e.preventDefault();
          Calendly.showPopupWidget('https://calendly.com/morganatgrowthfountain/15min');
          return false;
        });
      });
    },
    initWow() {
      this.$wowJs = this.$el.find('.wow');
      if (!this.$wowJs || !this.$wowJs.length)
        return;
      app.helpers.scripts.load('https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js').then(() => {
        var wow = new WOW(
          {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       0,          // distance to the element when triggering the animation (default is 0)
            mobile:       true,       // trigger animations on mobile devices (default is true)
            live:         true,       // act on asynchronously loaded content (default is true)
            callback:     function(box) {
              // the callback is fired every time an animation is started
              // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
          }
        );
        wow.init();
      });
    },

    initialize(options) {
      this.template = require(`./templates/${ options.template }.pug`);

    },

    render() {
      this.$el.html(
        this.template({})
      );
      setTimeout(() => {
        this.initCalendly();
        this.initCarousel();
        this.initWow();
        this.initAudioModalEvents();
      }, 10);

      if (app.user.data.info.length === 0 && window.location.pathname == '/pg/success_guide_1') {
        setTimeout(() => {
          api.makeRequest(
              app.config.emailServer + '/subscribe',
              'PUT',
              {'type': 'guide'}
              );
        }, 2500);
      }

      return this;
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      app.clearClasses('#page', ['page']);
      if (this.$owlCarousel && this.$owlCarousel.length) {
        this.$owlCarousel.hide();
        this.$owlCarousel.owlCarousel('destroy');
        this.$owlCarousel = null;
      }
      if (this.wow) {
        document.head.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"]').remove();
        this.wow.destroy();
        this.wow = null;
      }
      if (this.$audioModal) {
        this.$audioModal.off('hidden.bs.modal');
        this.$audioModal = null;
      }
    },

    accordeonHandler(e) {
      this.$el.find('.list-group-item-action').removeClass('active');
      this.$el.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

      const $elem = $(e.target);
      const $icon = $elem.find('.fa');

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
    },
  }),
};

module.exports = Object.assign({
  createView(page) {
    app.addClassesTo('#page', [page]);
    const template = templateMap[page] || page;
    return withLeftMenuPages.includes(page)
      ? new Views.WithLeftMenu({ template })
      : new Views.pg({ template });
  },
}, Views);
