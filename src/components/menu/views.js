const Notifications = require('./notifications');

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
  
  profile: Backbone.View.extend({
    template: require('./templates/profile.pug'),
    events: {
      'click .logout': 'logout',
    },

    logout: function (event) {
      app.routers.navigate(
        event.target.pathname,
        { trigger: true, replace: false }
      );
    },

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
    events: {

    },

    initialize(options) {
      this.notifications = new Notifications();
      this.notifications.on('notification', (data) => {
        console.log(JSON.stringify(data))
        this.$notificationsCount.text((+this.$notificationsCount.text() || 0) + data.length)
        _.each(data, (m) => {
          //update unread count
          this.$notifications.append(this.snippets.message(m))
        });
      });

      this.snippets = {
        message: require('./templates/snippets/message.pug'),
      };
    },

    render: function () {
      if (app.user.is_anonymous())
        return this;

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: app.user.toJSON(),
          notifications: [],
          Urls: Urls,
        })
      );

      this.$notifications = $('.notification-container ul.notifications');
      this.$notificationsCount = $('.count-notific');

      return this;
    },
  }),
};
