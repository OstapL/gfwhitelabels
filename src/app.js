const Router = require('./router.js');
const User = require('components/accountProfile/user.js');
const Menu = require('components/menu/views.js');

class App {
  constructor() {
    this.cache = {};
    this.helpers = require('./helpers.js');
    this.config = require('./config.js');
    this.cookies = require('cookies-js');
    this.fields = require('./fields.js');
    this.validation = require('components/validation/validation.js');
    this.models = require('./models.js');
    this.user = new User();
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
  }

  emitGoogleAnalyticsEvent(eventName, params={}) {
    //TODO: this will be fixed when we fix facebook/googleTagManager scripts
    if (!window.ga)
      return;// console.error('Google analytics API is not available');

    const page = Backbone.history.getPath();
    ga('set', 'page', '/' + page);
    ga('send', 'pageview', params);
  }

  showLoading() {
    $('.loader_overlay').show();
  }

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
  }

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

  getVideoId(url) {
    try {
      let provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2];
      provider = provider.toLowerCase();
      let id;
      if (provider === 'youtube') {
        id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=([^\&]*)/)[2];
      } else if (provider === 'youtu') {
        provider = 'youtube';
        id = url.match(/https:\/\/(?:www.)?(\w*).be\/(.*)/)[2];
      } else if (provider === 'vimeo') {
        id = url.match(/https:\/\/(?:www.)?(\w*).com\/(\d*)/)[2];
      } else {
        console.log(url, 'Takes a YouTube or Vimeo URL');
      }

      return { id: id, provider: provider };

    } catch (err) {
      console.log(url, 'Takes a YouTube or Vimeo URL');
    }
  }

  getVideoUrl(videoInfo) {
    var provider = videoInfo && videoInfo.provider ? videoInfo.provider : '';

    if (provider === 'youtube')
      return '//www.youtube.com/embed/' + videoInfo.id + '?rel=0';

    if (provider === 'vimeo')
      return '//player.vimeo.com/video/' + videoInfo.id;

    return '//www.youtube.com/embed/?rel=0';
  }

  getThumbnail(size, thumbnails, _default) {
    let thumb = thumbnails.find(function (el) {
      return el.size == size;
    });
    return (thumb ? thumb.url : _default || require('images/default/Default_photo.png'))
  }

  getUrl(data) {
    data = Array.isArray(data) ? data[0] : data;

    if (!data || !data.urls || !data.urls.length || !data.urls[0])
      return null;

    return this.getFilerUrl(data.urls[0]);
  }

  getFilerUrl(file) {
    if (!file || !_.isString(file))
      return null;

    if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/'))
      return file;

    return app.config.bucketServer + '/' + file;
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

    elem.classList.forEach((cls) => {
      if (!except.includes(cls))
        elem.classList.remove(cls);
    });
  }

}

let __instance = null;

module.exports = () => {
  if (__instance === null)
    __instance = new App();

  return __instance;
};
