require('src/sass/mixins_all.sass');
require('./shims.js');
require('./extensions.js');
//TODO: remove this on next iteration
global.api = require('./helpers/forms.js');
global.onYouTubeIframeAPIReady = () => {
  app.helpers.scripts.onYoutubeAPILoaded();
};

$(document).ready(function() {
  require('./eventHandlers.js');
  const App = require('app.js');
  global.app = new App();
  app.start();
});
