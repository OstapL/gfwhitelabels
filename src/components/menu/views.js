module.exports = {
  menu: Backbone.View.extend({
    template: require('./templates/menu.pug'),
    render: function () {
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: app.user.toJSON(),
          Urls: Urls,
        })
      );
      return this;
    },
  }),

  footer: Backbone.View.extend({
    template: require('./templates/footer.pug'),
    render: function () {
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: app.user.toJSON(),
          Urls: Urls,
        })
      );
      return this;
    },
  }),

  notification: Backbone.View.extend({
    template: require('./templates/notification.pug'),
    render: function () {
      if (app.user.token) {

        this.$el.html(
          this.template({
            serverUrl: serverUrl,
            user: app.user.toJSON(),
            nofiticaiton: [],
            Urls: Urls,
          })
        );
      }

      return this;
    },
  }),
};
