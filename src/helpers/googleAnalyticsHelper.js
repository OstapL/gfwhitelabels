module.exports = {
  methods: {
    initialize() {
      this.on('route', this._trackPageview);
    },

    _trackPageview: function() {
      var url;
      // If we wanna track the params in url as well, we use the following line instead.
      // url = Backbone.history.getFragment();
      url = Backbone.history.getPath();
      ga('send', 'pageview', "/" + url);
    },
  },
};