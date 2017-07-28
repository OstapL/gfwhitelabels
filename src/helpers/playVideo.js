const _preload = {};

const preloadScripts =(providers=['youtube', 'vimeo']) => {
  providers.forEach((provider) => {
    if (_preload[provider])
      return;

    if (provider === 'youtube')
      _preload[provider] = app.helpers.scripts.loadYoutubePlayerAPI();
    else if (provider === 'vimeo')
      _preload[provider] = app.helpers.scripts.loadVimeoPlayerAPI();
  });
};

const loadPlayer = (provider) => {
  if (!_preload[provider])
    preloadScripts([provider]);

  return _preload[provider];
};

const attachYoutubeEvents = ($modal, hidePage, callback) => {
  let player = null;
  let eventSent = false;

  $modal.on('show.bs.modal', () => {
    player = new YT.Player('video-iframe-container', {
      // videoId: videoInfo.id,
      events: {
        onReady(e){},
        onStateChange(e) {
          if (e.data == YT.PlayerState.PLAYING && !eventSent) {
            eventSent = true;
            callback();
          }
        },
        onError(err) {
          console.error(err);
        },
      }
    });
    if (hidePage)
      $('body').addClass('show-video-modal');
  }).on('hide.bs.modal', (e) => {
    $('body').removeClass('show-video-modal');
  }).on('hidden.bs.modal', () => {
    player.stopVideo();
    player.destroy();
    player = null;
    $modal.empty();
    $modal.remove();
  });
};

const attachVimeoEvents = ($modal, hidePage, callback) => {
  let player = null;
  let eventSent = false;
  $modal.on('show.bs.modal', () => {
    player = new Vimeo.Player('video-iframe-container');
    player.on('play', () => {
      if (!eventSent) {
        eventSent = true;
        callback();
      }
    });

    if (hidePage)
      $('body').addClass('show-video-modal');
  }).on('hide.bs.modal', (e) => {
    $('body').removeClass('show-video-modal');
  }).on('hidden.bs.modal', () => {
    player.off('play');
    player.unload().then(() => {
      player = null;
      $modal.empty();
      $modal.remove();
    }).catch(console.error);
  });
};

module.exports = {
  showVideoModal(e) {
    let $target = $(e.target).closest('a');

    const provider = $target.data('provider');
    const id = $target.data('id');
    const url = $target.data('url');
    const hidePage = !!$target.data('hide-page');
    const modalClass = $target.data('modal-class');

    loadPlayer(provider).then(() => {
      let $content = $('#content');
      const template = require('templates/videoModal.pug');

      $content.append(template({
        provider,
        id,
        url,
        modalClass,
      }));

      const sendVideoPlayEvent = () => {
        app.analytics.emitEvent(app.analytics.events.VideoViewed, app.user.stats);
      };

      let $modal = $('#videoModal');

      if (provider === 'youtube')
        attachYoutubeEvents($modal, hidePage, sendVideoPlayEvent);
      else if (provider === 'vimeo')
        attachVimeoEvents($modal, hidePage, sendVideoPlayEvent);

      $modal.modal('show');
    });
  },

  preloadScripts,
};