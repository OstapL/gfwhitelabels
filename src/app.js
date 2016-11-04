global.config = require('config');
global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
window.Tether = require('tether');
global.Bootstrap = require('bootstrap/dist/js/bootstrap.js');
global.userModel = require('components/accountProfile/model.js');
global.Urls = require('./jsreverse.js');
require('jquery-serializejson/jquery.serializejson.min.js');
document.title = pageTitle;
// require('sass/mixins_all.sass');

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

var oldSync = Backbone.sync;
Backbone.sync = function (method, model, options) {
  options.beforeSend = function (xhr) {
    //xhr.setRequestHeader('X-CSRFToken', getCSRF());
    let token = localStorage.getItem('token');
    if (token !== null && token !== '') {
      xhr.setRequestHeader('Authorization', 'Token ' + token);
    }
  };

  return oldSync(method, model, options);
};

let app = {
  $: jQuery,

  routers: {},
  cache: {},

  /*
   * Misc Display Functions
   *
   */
  showLoading() {
    $('.loader_overlay').show();
  },

  hideLoading(time) {
    time = time || 500;
    if (time > 0) {
      $('.loader_overlay').animate({
        opacity: 0,
      }, time, function () {
        $(this).css('display', 'none');
        $(this).css('opacity', '1');
      });
    } else {
      $('.loader_overlay').css('display', 'block');
    }
  },

  getParams() {
    // gets url parameters and builds an object
    return _.chain(location.search.slice(1).split('&'))
      .map(function (item) {
        if (item) {
          return item.split('=');
        }
      })
      .compact()
      .object()
      .value();
  },

  getVideoId(url) {
    try {
      var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2];
      provider = provider.toLowerCase();
      var id;

      if (provider == 'youtube') {
        id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=(.*)/)[2];
      } else if (provider == 'vimeo') {
        id = url.match(/https:\/\/(?:www.)?(\w*).com\/(\d*)/)[2];
      } else {
        console.log(url, 'Takes a YouTube or Vimeo URL');
      }
      
      return {id: id, provider: provider};
    } catch (err) {
      console.log(url, 'Takes a YouTube or Vimeo URL');
    }
  },

  getThumbnail: function(size, thumbnails, _default) {
    let thumb = thumbnails.find(function(el) {
      return el.size == size
    });
    return (thumb ? thumb.url : _default || '/img/default/default.png')
  },
};

// Что-то пахнет говнецом
_.extend(app, Backbone.Events);
app.user = new userModel();
global.api = require('helpers/forms.js');
_.extend(app, api);
global.app = app;

// app routers
app.routers = require('routers');
app.user.load();
app.trigger('userReady');

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

// show bottom logo while scrolling page
$(window).scroll(function () {
  var $bottomLogo = $('#fade_in_logo');
  var offsetTopBottomLogo = $bottomLogo.offset().top;

  if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) &&
    !$bottomLogo.hasClass('fade-in')) {
    $bottomLogo.addClass('fade-in');
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

$('body').on('click', '#menuList .nav-item', function (event) {
  var href = $(event.target).attr('href');

  if ($('.navbar-toggler:visible').length !== 0) {
    $(this).find('.list-container').slideToggle();

    if (href.indexOf('/') != -1) {
      $('html').toggleClass('show-menu');
    }
  }
});

$('body').on('click', 'a', function (event) {
  var href = event.currentTarget.getAttribute('href');
  if (href == window.location.pathname) {
    window.location.reload();
  } else if (href && href != '' && href.substr(0, 1) != '#' &&
    href.substr(0, 4) != 'http' &&
    href.substr(0, 3) != 'ftp' &&
    href.substr(0, 7) != 'mailto:' &&
    href != 'javascript:void(0);' &&
    href != 'javascript:void(0)' &&
    event.currentTarget.getAttribute('target') == null) {
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
          url, { trigger: true, replace: false }
      );
      app.trigger('userReady');
      app.trigger('menuReady');
    } else {
      $('#content').html(app.cache[url]);
      app.routers.navigate(
          url, { trigger: false, replace: false }
      );
      app.trigger('userReady');
      app.trigger('menuReady');
    }
  }
});