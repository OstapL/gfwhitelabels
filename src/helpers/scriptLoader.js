//TODO: refactor
//potential problem: if we call load(url) multiple times before script is loaded
//we load script multiple times
//solution cache Promise and return that Promise
const loadedScripts = {};

const createScript = (url, options={}) => {
  let script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');

  if (options.onLoad) script.onload = options.onLoad;
  if (options.onError) script.onerror = options.onError;

  script.async = true;
  script.defer = true;

  return script;
};

const createStyle = (url, options={}) => {
  let style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = url;

  if (options.onLoad)
    style.onload = options.onLoad;

  if (options.onError)
    style.onerror = options.onError;

  return style;
};


const scriptLoader = Object.assign({
  load(url) {
    return new Promise((resolve, reject) => {
      if (!url)
        return reject('URL is not provided');

      if (loadedScripts[url])
        return resolve();

      const script = createScript(url, {
        onLoad() {
          loadedScripts[url] = true;
          resolve();
        },
        onError: reject,
      });

      document.head.appendChild(script);
    });
  },

  loadLinkedInAPI() {
    const url = '//platform.linkedin.com/in.js';

    return new Promise((resolve, reject) => {
      if (loadedScripts[url])
        return resolve();

      const script = createScript(url, {
        onError: reject,
      });

      script.text = 'api_key: ' + app.config.linkedinClientId + '\n' +
        'authorize: true\n' +
        'onLoad: app.helpers.scripts.onLinkedInLoaded';

      this.on('linkedin-loaded', () => {
        loadedScripts[url] = true;
        resolve();
      });

      document.head.appendChild(script);
    });
  },

  onLinkedInLoaded() {
    scriptLoader.trigger('linkedin-loaded');
  },

  loadYoutubePlayerAPI() {
    const url = 'https://www.youtube.com/iframe_api';

    return new Promise((resolve, reject) => {
      if (loadedScripts[url])
        return resolve();

      const script = createScript(url, {
        onError: reject,
      });

      this.on('youtube-api-ready', () => {
        loadedScripts[url] = true;
        resolve();
      });

      document.head.appendChild(script);
    });
  },

  onYoutubeAPILoaded() {
    scriptLoader.trigger('youtube-api-ready');
  },

  loadVimeoPlayerAPI() {
    const url = 'https://player.vimeo.com/api/player.js';
    return this.load(url);
  },

  loadGoogleMapsAPI() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=' + app.config.googleMapKey + '&callback=app.helpers.scripts.onGoogleMapsAPILoaded';

    return new Promise((resolve, reject) => {
      if (loadedScripts[url])
        return resolve();

      const script = createScript(url);

      this.on('google-maps-loaded', () => {
        loadedScripts[url] = true;
        resolve();
      });
      document.head.appendChild(script);
    });
  },

  onGoogleMapsAPILoaded() {
    scriptLoader.trigger('google-maps-loaded');
  },

  loadCalendlyAPI() {
    const calendlyStyleURL = 'https://calendly.com/assets/external/widget.css';
    const calendlyScriptURL = 'https://calendly.com/assets/external/widget.js';

    if (loadedScripts[calendlyScriptURL])
      return Promise.resolve();

    return Promise.all([
      app.helpers.scripts.loadStyle(calendlyStyleURL),
      app.helpers.scripts.load(calendlyScriptURL),
    ]);
  },

  loadStyle(url) {
    if (loadedScripts[url])
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      const style = createStyle(url, {
        onLoad: resolve,
        onError: reject,
      });
      document.head.appendChild(style);
    });
  },

}, Backbone.Events);

//linkedIn API ready callback is called with undefined context
//so we need to use scriptLoader explicitly
module.exports = scriptLoader;