const Notifications = require('./notifications');
const notifications_channel = 'general';
const HIDE_TIMEOUT = 1000;

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
      'click .notification.notification-bell': 'showNotifications',
      // 'mouseover .notification-container': 'showNotifications',
      // 'mouseout .notification-bell': 'hideNotifications',
    },

    initialize(options) {
      this.model = {
        data: [],
      };

      this.snippets = {
        notification: require('./templates/snippets/notification.pug'),
      };

      this.initNotifications();

      this._hideTimeout = null;
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

      this.$notificationContainer = this.$('.notification-bell');
      this.$notificationList = this.$('.notification-container ul.notifications');
      this.$notificationsCount = this.$('.count-notific');

      return this;
    },

    showNotifications(e) {
      this.$notificationContainer.toggleClass('notification-active');
      return;
      if(this._hideTimeout) {
        clearTimeout(this._hideTimeout);
        this._hideTimeout = null;
      }

      if (this.$notificationContainer.hasClass('notification-active'))
        return;

      console.log('show notifications');
      this.$notificationContainer.addClass('notification-active');
    },

    hideNotifications(e) {
      if (this._hideTimeout) {
        clearTimeout(this._hideTimeout);
        this._hideTimeout = null;
      }

      setTimeout(() => {
        console.log('hide notifications')
        if (this.$notificationContainer.hasClass('notification-active'))
          this.$notificationContainer.removeClass('notification-active');
      }, HIDE_TIMEOUT);
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
      this.notifications.on(notifications_channel, (data) => {
        this.model.data = this.model.data.concat(data);
        this.updateUnreadCount();
        _.each(data, (m) => {
          this.$notificationList.prepend(this.snippets.notification(m));
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
