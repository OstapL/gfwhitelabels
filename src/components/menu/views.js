const Notifications = require('./notifications.js');
const notifications_channel = 'general';
const HIDE_TIMEOUT = 500;

module.exports = {
  menu: Backbone.View.extend({
    template: require('./templates/menu.pug'),
    render: function () {
      this.$el.html(
        this.template({
          user: app.user.toJSON(),
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
          user: app.user.toJSON(),
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
          user: app.user.toJSON(),
        })
      );
      return this;
    },
  }),

  notification: Backbone.View.extend({
    template: require('./templates/userNotifications.pug'),

    events: {
      'click .notification.notification-bell': 'showNotifications',
      'mouseover .notification-bell': 'showNotifications',
      'mouseover .notification-container': 'showNotifications',
      'mouseout .user-notifications-list': 'hideNotifications',
      'mouseout .notification-bell': 'hideNotifications',
      'mouseover .notification-item': 'markAsRead',
    },

    initialize(options) {
      if (app.user.is_anonymous())
        return;

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
          user: app.user.toJSON(),
          notifications: this.model.data,
          unreadCount: this.countUnreadMessages(),
          snippets: this.snippets,
        })
      );

      this.$notificationContainer = this.$('.notification-bell');
      this.$notificationList = this.$('.notification-container ul.notifications');
      this.$notificationsTextHeader = this.$('.notification-text-header');
      this.$notificationsCount = this.$('.count-notific');

      return this;
    },

    showNotifications(e) {
      this._clearTimeout();

      if (this.$notificationContainer.hasClass('notification-active'))
        return;

      this.$notificationContainer.addClass('notification-active');
    },

    _clearTimeout() {
      if (this._hideTimeout) {
        clearTimeout(this._hideTimeout);
        this._hideTimeout = null;
      }
    },

    hideNotifications(e) {
      if (this._hideTimeout)
        return;

      this._hideTimeout = setTimeout(() => {
        if (this.$notificationContainer.hasClass('notification-active'))
          this.$notificationContainer.removeClass('notification-active');
      }, HIDE_TIMEOUT);
    },

    countUnreadMessages() {
      let count = 0;
      (this.model.data || []).forEach((n) => {
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

      let text = unreadCount <= 0
        ? 'notifications'
        : ` pending notification${unreadCount > 1 ? 's' : ''}`

      this.$notificationsTextHeader.text(text);
    },

    initNotifications() {
      Notifications.getInstanceAsync().then((instance) => {
        this.notifications = instance;
        this.notifications.on(notifications_channel, (data) => {
          this.model.data = this.model.data.concat(data);
          this.updateUnreadCount();
          let notificationsHtml = data.map(this.snippets.notification);
          this.$notificationList.prepend(notificationsHtml);
        });
      });
    },

    updateNotification(notification) {
      this.$('.notification-item[data-id=' + notification.id + ']').replaceWith(this.snippets.notification(notification));
    },

    markAsRead(e) {
      e.preventDefault();

      const id = $(e.target).closest('.notification-item').data('id');

      let notification = (this.model.data || []).find(m => m.id == id);
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
      let unreadNotifications = (this.model.data || []).filter(n => !n.read_flag);
      if (!unreadNotifications || !unreadNotifications.length)
        return;

      unreadNotifications.forEach((n) => {
        n.read_flag = true;
        this.notifications.markAsRead(n.id);
        this.updateNotification(n);
      });

      this.updateUnreadCount();
    },

  }),
};
