const Router = require('./router.js');
const User = require('components/accountProfile/user.js');
const Menu = require('components/menu/views.js');
const getVideoId = require('get-video-id');

const preventScrollHandler = (e) => {
  e.preventDefault();
  return false;
};

function showLoadingSpinner() {
  $('.loader_overlay').show();
  const now = new Date();
  return now.valueOf();
}

function hideLoadingSpinner(time=500) {
  if (time > 0) {
    $('.loader_overlay').animate({
      opacity: 0,
    }, time, function () {
      $(this).css('display', 'none');
      $(this).css('opacity', '1');
    });
  } else {
    $('.loader_overlay').css('display', 'none');
  }
}

class App {
  constructor() {
    this.cache = {};
    this.analytics = require('./helpers/analytics.js');
    this.helpers = require('./helpers.js');
    this.config = require('./config.js');
    this.cookies = require('cookies-js');
    this.fields = require('./fields/fields.js');
    this.validation = require('components/validation/validation.js');
    this.dialogs = require('directives/dialogs/index.js');
    this.models = require('./models.js');
    this.sites = require('./sites.js');
    this.seo = require('./seo.js');
    this.utils = require('./utils.js');
    this.user = new User();
    this.currentView = null;

    this._spinnerTimeout = null;
    this._spinnerStartTime = null;
    return this;
  }

  start() {
    this.user.loadWithPromise().then(() => {

      this.routers = new Router();
      Backbone.history.start({ pushState: true });
      window.addEventListener('popstate', this.routers.back);

      this.menu = new Menu.menu({
        el: '#menuList',
      });
      this.menu.render();

      this.footer = new Menu.footer({
        el: '.footer_new',
      });
      this.footer.render();

      this.notification = new Menu.notification({
        el: '#menuNotification',
      });
      this.notification.render();
      this.profile = new Menu.profile({
        el: '#menuProfile',
      });
      this.profile.render();
    });
  }

  showLoading(delay=300) {
    delay = Number(delay);
    delay = isNaN(delay) ? 0 : delay;
    if (delay <= 0) {
      this._spinnerTimeout && clearTimeout(this._spinnerTimeout);
      this._spinnerStartTime = showLoadingSpinner();
      return;
    }

    if (this._spinnerTimeout || this._spinnerStartTime)
      return;

    this._spinnerTimeout = setTimeout(() => {
      clearTimeout(this._spinnerTimeout);
      this._spinnerTimeout = null;
      this._spinnerStartTime = showLoadingSpinner();
    }, delay);
  }

  hideLoading(immediate=false) {
    if (immediate) {
      if (this._spinnerTimeout)
        clearTimeout(this._spinnerTimeout);

      hideLoadingSpinner();
      this._spinnerStartTime = null;
      return;
    }

    if (!this._spinnerTimeout && !this._spinnerStartTime)
      return;

     if (this._spinnerTimeout) {
       hideLoadingSpinner();
       clearTimeout(this._spinnerTimeout);
       this._spinnerTimeout = null;
       return;
     }

    const now = (new Date()).valueOf();
    const passedTime = now - this._spinnerStartTime;
    const showSpinnerDuration = 600;
    const timeToWait = showSpinnerDuration - passedTime;
    if (timeToWait <= 0) {
      hideLoadingSpinner();
      this._spinnerStartTime = null;
      return;
    }

    setTimeout(() => {
      hideLoadingSpinner();
      this._spinnerStartTime = null;
    }, timeToWait);
  }

  getParams() {
    // gets url parameters and builds an object
    const res = {};
    (location.search.slice(1).split('&') || []).forEach((item) => {
      if (!item)
        return;

      const [name, value] = item.split('=');
      res[name] = decodeURIComponent(value);
    });
    return res;
  }

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
  }

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
  }

  valByKeyReplaceArray(obj, keyString) {
    if (keyString.indexOf('[') !== -1) {
      keyString = keyString.replace(/\[\d+\]/, '.schema');
      keyString = keyString.replace(/\[\d+\]/g, '');
    }
    return app.valByKey(obj, keyString);
  }

  //TODO: remove this from here
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

  }

  getVideoInfo(url) {
    if (typeof(url) !== 'string')
      url = '';

    const info = getVideoId(url);
    if (!info || !['youtube', 'vimeo'].includes(info.service))
      return {};

    const videoURL = (info.service === 'youtube')
      ? `//www.youtube.com/embed/${info.id}?rel=0&enablejsapi=1`
      : (info.service === 'vimeo')
        ? `//player.vimeo.com/video/${info.id}`
        : '//www.youtube.com/embed/?rel=0';

    //lib does not handle hash after id
    if (info.id) {
      info.id = info.id.replace(/\#(.)*$/g, '');
    }

    return {
      id: info.id,
      provider: info.service,
      url: videoURL,
    };
  }

  getUrl(data) {
    data = Array.isArray(data) ? data[0] : data;

    if (!data || !data.urls)
      return null;

    return this.getFilerUrl(data.urls);
  }

  getFilerUrl(file) {
    if (!file.origin || typeof(file.origin) !== 'string')
      return null;

    if (file.origin.startsWith('http://') || file.origin.startsWith('https://') )
      return file.origin;

    // ToDo
    // get bucket server base on the site_id of the file
    // i.e. app.sites[file.site_id] + file.origin;
    return this.config.bucketServer + file.origin;
  }

  breadcrumbs(title, subtitle, data) {
    const template = require('templates/breadcrumbs.pug');
    return template({
      title: title,
      subtitle: subtitle,
      data: data,
    });
  }

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
  }

  getIssuerDashboardUrl(companyId) {
    return `dashboard/${companyId}/issuer-dashboard`;
  }

  addClassesTo(selector, classes=[]) {
    var elem = document.querySelector(selector);
    if (!elem || !classes.length)
      return;

    classes.forEach((cls) => {
      if (!elem.classList.contains(cls))
        elem.classList.add(cls);
    });
  }

  clearClasses(selector, except=['page']) {
    let elem = document.querySelector(selector);
    if (!elem)
      return;

    for (let i = 0; i < elem.classList.length; i += 1) {
      let cls = elem.classList.item(i);
      if (!except.includes(cls))
        elem.classList.remove(cls);
    }
  }

  setMeta(options) {
      const { name, content } = options;

      let meta = document.head.querySelector('meta[name=' +name + ']');
      if (meta) {
          meta.setAttribute('content', content)
      } else {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
      }
  }

  isElementInView(element, percentsInView) {
    const $w = $(window);
    const $el = $(element);

    const windowTop = $w.scrollTop();
    const windowBottom = windowTop + $w.height();
    const elementTop = $el.offset().top;
    const elementBottom = elementTop + $el.height();

    let visibleElementHeight = Math.min(windowBottom, elementBottom) - Math.max(windowTop, elementTop);
    if (visibleElementHeight <= 0)
      return false;

    percentsInView = Number(percentsInView);
    if (!isNaN(percentsInView)) {
      const visiblePercents = visibleElementHeight / $el.height();
      return visiblePercents >= percentsInView;
    }

    return ((elementTop <= windowBottom) && (elementBottom >= windowTop));
  }

  preventBodyScrolling(preventScroll) {
    if (preventScroll === true) {
      document.body.addEventListener("touchmove", preventScrollHandler);
    } else {
      document.body.removeEventListener("touchmove", preventScrollHandler);
    }
  }


}

let __instance = null;

module.exports = () => {
  if (__instance === null)
    __instance = new App();

  return __instance;
};
