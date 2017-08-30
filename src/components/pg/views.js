function paralaxScrollHandler() {
  const st = $(this).scrollTop() /15;

  $(".scroll-paralax .background").css({
    "transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-o-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-webkit-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-moz-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-ms-transform" : "translate3d(0px, " + st /2 + "%, .01px)"
  });
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
}

module.exports = {
  WithLeftMenu: Backbone.View.extend({
    el: '#content',

    initialize(options) {
      this.template = options.template;
      this.scrollHandler = null;
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      if (this.scrollHandler) {
        $(window).off('scroll', this.scrollHandler);
        this.scrollHandler = null;
      }
    },

    render() {
      this.$el.html(
        this.template(
          this.model
        ),
      );

      if (!this.scrollHandler) {
        this.scrollHandler = this.updateMenuOnScroll.bind(this);
        $(window).on('scroll', this.scrollHandler);
      }

      return this;
    },

    updateMenuOnScroll(e) {
      const leftMenu = this.el.querySelector('.pages-left-menu');
      if (!leftMenu)
        return;

      const menuItems = leftMenu.querySelectorAll('a');
      const visibleElements = _(menuItems).map((menuItem) => {
        const href = menuItem.getAttribute('href');
        return href && href.startsWith('#')
          ? document.getElementById(href.replace('#', ''))
          : null;
      }).filter(scrollElement => scrollElement && app.isElementInView(scrollElement, 0.9));

      const visibleTopmostElement = visibleElements ? visibleElements[0] : null;
      if (!visibleTopmostElement)
        return;

      _.each(menuItems, (menuItem) => {
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
    template: require('src/templates/mainPage.pug'),
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
      this.attachEvents();
    },

    attachEvents() {
      if (!this.srollHandler) 
        $(window).on('scroll', this.scrollHandler = paralaxScrollHandler.bind(this));

      if (!this.resizeHandler) {
        scaleVideoContainer();
        initBannerVideoSize('.video-container .poster img');
        initBannerVideoSize('.video-container .filter');
        initBannerVideoSize('.video-container video');
        
        $(window).on('resize', this.resizeHandler = resizeHandler.bind(this));
      }
    },

    destroy() {
      if (this.$carousel) {
        this.$carousel.owlCarousel('destroy');
        this.$carousel = null;
      }

      if (this.scrollHandler) {
        $(window).off('scroll', this.scrollHandler);
        this.scrollHandler = null;
      }

      if (this.resizeHandler) {
        $(window).off('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
    },

    render() {
      this.$el.html(this.template({ collection: this.collection, }));
      this.postRender();
      return this;
    },

  }),

};
