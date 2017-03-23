global.cookies = require('cookies-js');
global.config = require('config');
global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
window.Tether = require('tether');
global.Bootstrap = require('bootstrap/dist/js/bootstrap.js');
global.OwlCarousel = require('owl.carousel/dist/owl.carousel.min.js');
// global.userModel = require('components/accountProfile/model.js');
global.Urls = require('./jsreverse.js');
require('jquery-serializejson/jquery.serializejson.min.js');
require('js/html5-dataset.js');

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

const validation = require('components/validation/validation.js');

const User = require('components/accountProfile/user.js');
// FixMe
// user app.helpers.format
global.formatHelper = require('helpers/formatHelper.js');

if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
}

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
      xhr.setRequestHeader('Authorization', token);
    }
  };

  return oldSync(method, model, options);
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
    if (!validation.validate(this.fields, this.model, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').prev().scrollTo(5);
    }
  }
};

let app = {
  $: jQuery,

  routers: {},
  cache: {},
  models: {}, //looks like unused code

  emitFacebookPixelEvent(eventName='ViewContent', params={}) {
    if (!window.fbq)
      return;// console.error('Facebook pixel API is not available');

    const STANDARD_EVENTS = [
      'ViewContent',
      'Search',
      'AddToCart',
      'AddToWishlist',
      'InitiateCheckout',
      'AddPaymentInfo',
      'Purchase',
      'Lead',
      'CompleteRegistration',
    ];
    if (_.contains(STANDARD_EVENTS))
      fbq('track', eventName, params);
    else
      fbq('trackCustom', eventName, params);
  },

  emitGoogleAnalyticsEvent(eventName, params={}) {
    //TODO: this will be fixed when we fix facebook/googleTagManager scripts
    if (!window.ga)
      return;// console.error('Google analytics API is not available');

    const page = Backbone.history.getPath();
    ga('set', 'page', '/' + page);
    ga('send', 'pageview', params);
  },

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
        let arr = item.split('=');
        arr[1] = decodeURIComponent(arr[1]);
        return arr;
      }
    })
    .compact()
    .object()
    .value();
  },

  valByKey(obj, keyString) {
    if (keyString.indexOf('.') == -1) {
      return values[keyString];
    } else {
      try {
        return keyString.split('.').reduce(function (o, i, currentIndex, array) {
          if (i.indexOf('[') != -1) {
            i = i.split('[');
            let k = i[0];
            i = i[1].replace(']', '');
            return o[k][i];
          }
          return o[i];
        }, obj);
      } catch (e) {
        console.debug('no name ' + keyString);
        return '';
      }
    }
  },

  setValByKey(obj, keyString, val) {
    if (keyString.indexOf('.') == -1) {
      return values[keyString];
    } else {
      try {
        return keyString.split('.').reduce(function (o, i, currentIndex, arr) {
          if (i.indexOf('[') != -1) {
            i = i.split('[');
            let k = i[0];
            i = i[1].replace(']', '');
            if (currentIndex == arr.length - 1) {
              o[k][i] = val;
            }
            return o[k][i];
          }
          if (currentIndex == arr.length - 1) {
            o[i] = val;
          }
          return o[i];
        }, obj);
      } catch (e) {
        console.debug('no name ' + keyString);
        return '';
      }
    }
  },

  valByKeyReplaceArray(obj, keyString) {
    if (keyString.indexOf('[') !== -1) {
      keyString = keyString.replace(/\[\d+\]/, '.schema');
      keyString = keyString.replace(/\[\d+\]/g, '');
    }
    return app.valByKey(obj, keyString);
  },

  fieldChoiceList(metaData, currentValue) {
    metaData = metaData.validate;
    if (Array.isArray(metaData.choices))//it looks like this is old approach
      return (metaData.labels)
        ? metaData.labels[metaData.choices.indexOf(currentValue.toString())]
        || metaData.labels[metaData.choices.indexOf(parseFloat(currentValue))]
        : metaData.choices.indexOf(currentValue.toString())
        || metaData.choices.indexOf(parseFloat(currentValue));

    //this is new approach
    return metaData.choices[currentValue] || currentValue;

  },

  getVideoId(url) {
    try {
      var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2];
      provider = provider.toLowerCase();
      var id;

      if (provider == 'youtube') {
        id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=([^\&]*)/)[2];
      } else if (provider == 'youtu') {
        provider = 'youtube';
        id = url.match(/https:\/\/(?:www.)?(\w*).be\/(.*)/)[2];
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

  getVideoUrl(videoInfo) {
    var provider = videoInfo && videoInfo.provider ? videoInfo.provider : '';

    if (provider == 'youtube')
      return '//www.youtube.com/embed/' + videoInfo.id + '?rel=0';

    if (provider == 'vimeo')
      return '//player.vimeo.com/video/' + videoInfo.id;

    return '//www.youtube.com/embed/?rel=0';
  },

  getThumbnail: function (size, thumbnails, _default) {
    let thumb = thumbnails.find(function (el) {
      return el.size == size;
    });
    return (thumb ? thumb.url : _default || '/img/default/default.png')
  },

  getUrl(data) {
    data = Array.isArray(data) ? data[0] : data;

    if (!data || !data.urls || !data.urls.length || !data.urls[0])
      return null;

    return this.getFilerUrl(data.urls[0]);
  },

  getFilerUrl(file) {
    if (!file || !_.isString(file))
      return null;

    if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/'))
      return file;

    return bucketServer + '/' + file;
  },

  breadcrumbs(title, subtitle, data) {
    const template = require('templates/breadcrumbs.pug');
    return template({
      title: title,
      subtitle: subtitle,
      data: data,
    });
  },

  initMap(options={
    lat: 40.7440668,
    lng: -73.98522220000001,
    content: '<b>Growth Fountain</b><br/>79 Madison Ave, 5th Floor, New York, NY 10016<br/> New York',
  }) {
    let mapElement = document.getElementById('map');
    if (!mapElement)
      return console.error('Missing map element');

    const coords = { lat: options.lat, lng: options.lng };
    let map = new google.maps.Map(mapElement, {
      zoom: 15,
      center: coords,
      scrollwheel: false,
    });
    let marker = new google.maps.Marker({
      position: coords,
      map: map,
    });
    let infowindow = new google.maps.InfoWindow({
      content: options.content || '',
    });
    google.maps.event.addListener(marker, "click", function(){ infowindow.open(map,marker); });
    infowindow.open(map, marker);
  },

  getIssuerDashboardUrl(companyId) {
    return `dashboard/${companyId}/issuer-dashboard`;
  }
};

// Что-то пахнет говнецом
_.extend(app, Backbone.Events);

global.api = require('helpers/forms.js');
_.extend(app, api);
global.app = app;

const Router = require('./routers.js');

// app routers
app.routers = require('routers');//TODO: refactor
app.fields = require('fields');
app.helpers = {};
app.helpers.format = require('helpers/formatHelper.js');

// app.user = new userModel();
app.user = new User();
app.user.load();
app.trigger('userReady');

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
  var valStr = e.target.value.replace(/[\$\,]/g, '');
  var val = parseInt(valStr);
  if (val) {
    e.target.value = '$' + val.toLocaleString('en-US');
  }
});

$('body').on('focus', '[type="money"]', function (e) {
  var valStr = e.target.value.replace(/[\$\,]/g, '');
  var val = parseInt(valStr);
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

  if (!href ||
    href.startsWith('#') ||
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
    app.trigger('userReady');
    app.trigger('menuReady');
  } else {
    $('#content').html(app.cache[url]);
    app.routers.navigate(
      url, {trigger: false, replace: false}
    );
    app.trigger('userReady');
    app.trigger('menuReady');
  }
});
