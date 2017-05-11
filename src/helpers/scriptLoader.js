const loadedScripts = {};

const createScript = (url, options={}) => {
  let script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');

  if (options.onLoad) script.onload = options.onLoad;
  if (options.onError) script.onerror = options.onError;

  return script;
};

const scriptLoader = _.extend({
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

}, Backbone.Events);

//linkedIn API ready callback is called with undefined context
//so we need to use scriptLoader explicitly
module.exports = scriptLoader;