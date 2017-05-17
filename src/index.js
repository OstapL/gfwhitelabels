require('src/sass/mixins_all.sass');
require('babel-polyfill');
require('jquery-serializejson/jquery.serializejson.min.js');
require('js/html5-dataset.js');
require('classlist-polyfill');

//fix for safari 9.1
// if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
// }

require('bootstrap/dist/js/bootstrap.js');
require('owl.carousel/dist/owl.carousel.min.js');

(function () {
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

function scrollLogoHandler() {
  let $bottomLogo = $('#fade_in_logo');
  let offsetTopBottomLogo = $bottomLogo.offset().top;
  let $window = $(window);
  if (($window.scrollTop() + $window.height() >= offsetTopBottomLogo)
    && !$bottomLogo.hasClass('fade-in')) {
    $bottomLogo.addClass('fade-in');
  }
}

function scrollMenuItemsHandler() {
  let lastId = '';
  let topMenu = $(".pages-left-menu");
  if (!topMenu.length)
    return;

  let topMenuHeight = topMenu.outerHeight();
  let menuItems = topMenu.find("a");
  let scrollItems = menuItems.map(function() {
    let href = $(this).attr("href");
    if (href && href.startsWith('#')) {
      let item = $(href);
      if (item.length) {
        return item;
      }
    }
  });

  let fromTop = $(window).scrollTop() + topMenuHeight;
  let cur = scrollItems.map(function() {
    if ($(this).offset().top < fromTop)
      return this;
  });
  cur = cur[cur.length - 1];
  let id = cur && cur.length ? cur[0].id : "";
  if (lastId !== id) {
    lastId = id;
    menuItems
      .parent().removeClass("active")
      .end().filter("[href='#" + id + "']").parent().addClass("active");
  }
}


$(document).ready(function () {
  // show bottom logo while scrolling page
  $(window).scroll((e) => {
    scrollLogoHandler(e);
    scrollMenuItemsHandler(e);
  });

  //attach global event handlers

//TODO: do we need this template and popover logic?
  const popoverTemplate = '<div class="popover  divPopover"  role="tooltip"><span class="popover-arrow"></span> <h3 class="popover-title"></h3> <span class="icon-popover"><i class="fa fa-info-circle" aria-hidden="true"></i></span> <span class="popover-content"> XXX </span></div>';

  $('body').on('mouseover', 'div.showPopover', function () {
    var $el = $(this);
    if ($el.attr('aria-describedby') == null) {
      $(this).popover({
        html: true,
        template: popoverTemplate,
        placement: 'top',
        trigger: 'hover',
      });
      $(this).popover('show');
    }
  });

  $('body').on('mouseout', 'div.showPopover', function () {
    //$(this).popover('hide');
  });

  $('body').on('focus', 'input.showPopover', function () {
    var $el = $(this);
    if ($el.attr('aria-describedby') == null) {
      $(this).popover({
        html: true,
        template: popoverTemplate.replace('divPopover', 'inputPopover'),
        placement: 'top',
        trigger: 'hover',
      });
      $(this).popover('show');
    }
  });

  $('body').on('focus', 'textarea.showPopover', function () {
    var $el = $(this);
    if ($el.attr('aria-describedby') == null) {
      $(this).popover({
        html: true,
        template: popoverTemplate.replace('divPopover', 'textareaPopover'),
        placement: 'top',
        trigger: 'hover',
      });
      $(this).popover('show');
    }
  });

  $('body').on('focus', 'i.showPopover', function () {
    var $el = $(this);
    if ($el.attr('aria-describedby') == null) {
      $(this).popover({
        html: true,
        template: popoverTemplate.replace('divPopover', 'textareaPopover'),
        placement: 'top',
        trigger: 'hover',
      });
      $(this).popover('show');
    }
  });

// show bottom logo while scrolling page
  $(window).scroll(function () {
    var $bottomLogo = $('#fade_in_logo');
    var offsetTopBottomLogo = $bottomLogo.offset().top;

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) && !$bottomLogo.hasClass('fade-in')) {
      $bottomLogo.addClass('fade-in');
    }
  });


// Money field auto correction
  $('body').on('keyup', '[type="money"]', function (e) {

    if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 190 || e.keyCode == 188 || e.keyCode == 91) {
      return;
    }

    var valStr = e.target.value.replace(/[\$\,]/g, '');
    var val = parseFloat(valStr);
    if (val) {
      var selStart = e.target.selectionStart;
      var selEnd = e.target.selectionEnd;
      e.target.value = '$' + val.toLocaleString('en-US');
      e.target.setSelectionRange(selStart, selEnd);
    }
  });

  $('body').on('focus', '[type="money"]', function (e) {
    var valStr = e.target.value.replace(/[\$\,]/g, '');
    var val = parseFloat(valStr);
    if (val == 0 || val == NaN) {
      e.target.value = '';
    }
  });

  $('body').on('blur', '[type="money"]', function (e) {
    var valStr = e.target.value.replace(/[\$\,]/g, '');
    if (e.target.value == '') {
      e.target.value = '$0';
    }
  });

// для показа биографии на стр. pg/team
  $('body').on('click', '.team-member-list article', function () {
    var targetTextId = $(this).css('z-index') == 2 && $(this).data('id-text-xs') ? $(this).data('id-text-xs') : $(this).data('id-text');

    if ($(targetTextId).hasClass('open')) {
      $(targetTextId).removeClass('open').slideUp();
    } else {
      $(this).closest('.team-member-list').find('.biography-text.open').removeClass('open').hide();
      $(targetTextId).addClass('open').slideDown();
    }
  });

// scripts for mobile menu
  $('body').on('click', '#toggle_mobile_menu', function () {
    $('html').toggleClass('show-menu');
  });

  $('html').on('click', function () {
    if ($('header').hasClass('no-overflow')) {
      $('header').removeClass('no-overflow');
    }
  });

  $('body').on('click', '.user-info', function () {
    if ($('.navbar-toggler:visible').length !== 0) {
      $('html').removeClass('show-menu');
      $('header').toggleClass('no-overflow');
    }

    return false;
  });

  $('body').on('click', '.notification-bell', function () {
    if ($('.navbar-toggler:visible').length !== 0) {
      $('html').removeClass('show-menu');
      $('header').toggleClass('no-overflow-bell');
    }

    return false;
  });

  $('body').on('click', '#menuList .nav-item, #menuList .mobile-signup', function (event) {
    var href = $(event.target).closest('a').attr('href');

    if ($('.navbar-toggler:visible').length !== 0) {
      $(this).find('.list-container').slideToggle();

      if (href && href.indexOf('/') != -1) {
        $('html').toggleClass('show-menu');
      }
    }
  });

  $('body').on('click', 'a', (event) => {
    const href = event.currentTarget.getAttribute('href');

    if (href == window.location.pathname) {
      window.location.reload();
      return;
    }

    if (href == '#') {
      event.preventDefault();
      return false;
    }

    //process click on menu item
    if (href && href.startsWith('#')) {
      let $target = $(event.currentTarget);
      let $leftMenu = $(' .pages-left-menu');
      if (!$leftMenu.length)
        return;

      let $activeItem = $target.closest('li');
      let $menuItems = $activeItem.siblings();
      $menuItems.each((_, elem) => $(elem).removeClass('active'));
      $activeItem.addClass('active');
      return;
    }

    if (!href ||
      href.startsWith('http') ||
      href.startsWith('ftp') ||
      href.startsWith('javascript:') ||
      event.currentTarget.getAttribute('target')) {
      return;
    }

    if (href.startsWith('mailto:')) {
      event.preventDefault();
      window.location = href;
      return false;
    }

    event.preventDefault();
    // If we already have that url in cache - we will just update browser location
    // and set cache version of the page
    // overise we will trigger app router function
    var url = href;

    // Clear page
    $('#content').undelegate();
    $('form').undelegate();
    $('.popover').remove();

    $('.modal-backdrop').remove();
    $('.modal-open').removeClass('modal-open');

    if (app.cache.hasOwnProperty(url) == false) {
      app.routers.navigate(
        url, {trigger: true, replace: false}
      );
      // app.trigger('userReady');
      // app.trigger('menuReady');
    } else {
      $('#content').html(app.cache[url]);
      app.routers.navigate(
        url, {trigger: false, replace: false}
      );
      // app.trigger('userReady');
      // app.trigger('menuReady');
    }
  });

});

$.fn.scrollTo = function (padding=0) {
  $('html, body').animate({
    scrollTop: $(this).offset().top - padding + 'px',
  }, 'fast');
  return this;
};

$.fn.equalHeights = function () {
  var maxHeight = 0;
  var $this = $(this);

  $this.each(function () {
    var height = $(this).innerHeight();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  return $this.css('height', maxHeight);
};


Backbone.View.prototype.assignLabels = function () {
  _(this.fields).each((el, key) => {
    if (el.type == 'nested') {
      _(el.schema).each((subel, subkey) => {
        if (this.labels[key])
          subel.label = this.labels[key][subkey];
      });
    } else {
      el.label = this.labels[key];
    }
  });
};

Backbone.View.prototype.checkForm = function () {
  if (app.getParams().check == '1') {
    if (!app.validation.validate(this.fields, this.model, this)) {
      Object.keys(app.validation.errors).forEach((key) => {
        let errors = app.validation.errors[key];
        if (this.el.querySelector('#' + key)) {
          app.validation.invalidMsg(this, key, errors);
        }
      });

      if(this.el.querySelector('.help-block') != null) {
        this.$('.help-block').prev().scrollTo(5);
      }
    }
  }
};

$.serializeJSON.defaultOptions = _.extend($.serializeJSON.defaultOptions, {
  customTypes: {
    decimal(val) {
      return app.helpers.format.unformatPrice(val);
    },
    money(val) {
      return app.helpers.format.unformatPrice(val);
    },
    integer(val) {
      return parseInt(val);
    },
    url(val) {
      return String(val);
    },
    text(val) {
      return String(val);
    },
    email(val) {
      return String(val);
    },
    password(val) {
      return String(val);
    },
  },
  useIntKeysAsArrayIndex: true,
  parseNulls: true,
  parseNumbers: true
});

//TODO: remove this on next iteration
global.api = require('./helpers/forms.js');
global.onYouTubeIframeAPIReady = () => {
  app.helpers.scripts.onYoutubeAPILoaded()
};

const App = require('app.js');

global.app = new App();
app.start();
