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
    template: require('./templates/userNotifications.pug'),
    events: {
      'mouseover .notification-item': 'markAsRead',
      'click .view-all': 'markAllAsRead',
    },

    initialize(options) {
      this.model = {
        data: [],
      };

      this.snippets = {
        notification: require('./templates/snippets/notification.pug'),
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
        this.$notificationsCount.show();
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
          this.$notifications.append(this.snippets.notification(m));
        });
      });
    },

    updateNotification(notification) {
      this.$('.notification-item[data-id=' + notification.id + ']').replaceWith(this.snippets.notification(notification));
    },

    markAsRead(e) {
      e.preventDefault();

      const id = $(e.target).closest('.notification-item').data('id');

      let notification = _.find(this.model.data, m => m.id == id);
      if (!notification || notification.read_flag)
        return;

      notification.read_flag = true;
      this.notifications.markAsRead(id);

      $(e.target).closest('li').replaceWith(this.snippets.notification(notification));

      this.updateUnreadCount();

      return false;
    },

    markAllAsRead(e) {
      //TODO: mark all notifications as read
      let unreadNotifications = _.filter(this.model.data, n => !n.read_flag);
      if (!unreadNotifications || !unreadNotifications.length)
        return;

      _.each(unreadNotifications, (n) => {
        n.read_flag = true;
        this.notifications.markAsRead(n.id);
        this.updateNotification(n);
      });

      this.updateUnreadCount();
    },

  }),
};
