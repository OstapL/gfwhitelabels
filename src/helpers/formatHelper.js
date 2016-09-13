module.exports = {
	appendHttpIfNecessary(e) {
      // var $el = $('#website');
      var $el = $(e.target);
      var url = $el.val();
      if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        $el.val("http://" + url);
      }
    },
};