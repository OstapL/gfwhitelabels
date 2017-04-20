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
    this.sites = require('./sites.js');
    this.user = new User();
    _.extend(this, Backbone.Events);
    return this;
  }

  start() {
    this.user.loadWithPromise().then(() => {

      if(app.config.googleTagIdGeneral || app.config.googleTagId) {
       this.initFacebookPixel();
      }

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

  initFacebookPixel() {
    dataLayer.push({
      event: 'fb-pixel-init'
    });
  }

  emitFacebookPixelEvent(eventName='ViewContent', params={}) {
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

    let trackType = (_.contains(STANDARD_EVENTS, eventName)) ? 'track' : 'trackCustom';

    dataLayer.push({
      event: 'fb-pixel-event',
      trackType,
      eventName,
    });
  }

  emitGoogleAnalyticsEvent(eventName, params={}) {
    if (!eventName)
      return console.error('eventName is not set');

    let hasRequiredParams = ['eventAction', 'eventCategory'].every(paramName => !!params[paramName]);
    if (!hasRequiredParams)
      return console.error('Required params are not set');
    
    params.event = eventName;
    dataLayer.push(params);
  }

  emitCompanyAnalyticsEvent(trackerId) {
    if (!trackerId)
      return;

    dataLayer.push({
      event: 'company-custom-event',
      eventCategory: 'Company',
      eventAction: 'ViewPage',
      trackerId,
    });
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
      return '//www.youtube.com/embed/' + videoInfo.id + '?rel=0&enablejsapi=1';

    if (provider === 'vimeo')
      return '//player.vimeo.com/video/' + videoInfo.id;

    return '//www.youtube.com/embed/?rel=0';
  }

  getVideoInfo(url) {
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

      let resUrl = (provider === 'youtube')
        ? `//www.youtube.com/embed/${id}?rel=0&enablejsapi=1`
        : (provider === 'vimeo')
          ? `//player.vimeo.com/video/${id}`
          : '//www.youtube.com/embed/?rel=0';

      return { id: id, provider: provider, url: resUrl };

    } catch (err) {
      console.log(url, 'Takes a YouTube or Vimeo URL');
    }

    return {};
  }

  getThumbnail(size, thumbnails, _default) {
    let thumb = thumbnails.find(function (el) {
      return el.size == size;
    });
    return (thumb ? thumb.url : _default || require('images/default/Default_photo.png'))
  }

  getUrl(data) {
    data = Array.isArray(data) ? data[0] : data;

    if (!data || !data.urls)
      return null;

    return this.getFilerUrl(data.urls);
  }

  getFilerUrl(file) {
    if (!file.origin || !_.isString(file.origin))
      return null;

    if (file.origin.startsWith('http://') || file.origin.startsWith('https://') )
      return file.origin;

    // ToDo
    // get bucket server base on the site_id of the file
    // i.e. app.sites[file.site_id] + file.origin;
    return app.config.bucketServer + file.origin;
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

  loadYoutubePlayerAPI() {
    return new Promise((resolve, reject) => {
      if (app.youtubeAPIReady)
        return resolve();

      let tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      this.on('youtube-api-ready', () => {
        resolve()
      });
    });
  }

  loadVimeoPlayerAPI() {
    return new Promise((resolve, reject) => {
      if (window.Vimeo)
        return resolve();

      let tag = document.createElement('script');

      tag.src = "https://player.vimeo.com/api/player.js";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = resolve;
      tag.onerror = reject;
    });
  }

  confirm(container, data) {
    return new Promise((resolve, reject) => {
      if (!data || !data.message)
        return resolve(true);

      let template = require('./templates/confirmPopup.pug');
      let $container = $(container);

      let $modal = $(template(data));

      $modal.on('shown.bs.modal', () => {
        $modal.on('click', '.confirm-yes', () => {
          $modal.modal('hide');
          resolve(true);
        });

        $modal.on('click', '.confirm-no', () => {
          $modal.modal('hide');
          resolve(false)
        });
      });

      $modal.on('hidden.bs.modal', () => {
        $modal.off('hidden.bs.modal');
        $modal.off('show.bs.modal');
        $modal.off('click');
        $modal.remove();
      });

      $container.append($modal);

      $modal.modal('show');
    });
  }

}

let __instance = null;

module.exports = () => {
  if (__instance === null)
    __instance = new App();

  return __instance;
};
