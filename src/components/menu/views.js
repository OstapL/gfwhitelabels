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
      'click .server-message': 'markAsRead',
    },

    initialize(options) {
      this.model = {
        data: [],
      };

      this.snippets = {
        message: require('./templates/snippets/message.pug'),
      };

      this.initNotifications();
    },

    render: function () {
      if (app.user.is_anonymous())
        return this;

      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          user: app.user.toJSON(),
          notifications: this.model.data,
          unreadCount: this.countUnreadMessages(),
          snippets: this.snippets,
        })
      );

      this.$notifications = $('.notification-container ul.notifications');
      this.$notificationsCount = $('.count-notific');

      return this;
    },

    countUnreadMessages() {
      let count = 0;
      _.each(this.model.data, (n) => {
        count += n.read_flag ? 0 : 1;
      });
      return count;
    },

    updateUnreadCount() {
      const unreadCount = this.countUnreadMessages();
      if (unreadCount)
        this.$notificationsCount.show()
      else
        this.$notificationsCount.hide();

      this.$notificationsCount.text(unreadCount || '');
    },

    initNotifications() {
      this.notifications = new Notifications();
      this.notifications.on('notification', (data) => {
        console.log(data);
        this.model.data = this.model.data.concat(data);
        this.updateUnreadCount();
        _.each(data, (m) => {
          this.$notifications.append(this.snippets.message(m));
        });
      });
    },

    markAsRead(e) {
      e.preventDefault();

      const message_id = $(e.target).closest('.server-message').data('messageid');

      let message = _.find(this.model.data, m => m.id == message_id);
      this.notifications.markAsRead(message_id);
      message.read_flag = true;

      $(e.target).closest('li').replaceWith(this.snippets.message(message));

      this.updateUnreadCount();

      return false;
    },

  }),
};
