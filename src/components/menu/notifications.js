const channels = ['message', 'notification', 'alert'];
let __instance = null;
const io = require('socket.io-client');

class Notifications {
  constructor() {
    _.extend(this, Backbone.Events);

    // if (!_.isFunction(window.io)) {
    //   console.error("socket.io script is not loaded");
    //   return this;
    // }

    this.__socket = io(notificationsServer);
    this.__socket.on('connect', () => {
      this.__socket.emit('subscribe', {
        jwt: app.user.token,
        channels: ['notification'],
        "numMessagesFromArchive": 0,
      });
    });

    this.__attachEvents();
  }

  __attachEvents() {
    _.each(channels, (channel) => {
      this.__socket.on(channel, (data) => {
        if (data === null || typeof data[Symbol.iterator] !== 'function')
          data = [data];

        this.trigger(channel, data);
      });
    });
  }

  markAsRead(messageId) {
    this.__socket.emit('mark_read', messageId);
  }

}



module.exports = () => {
  if (!__instance)
    __instance = new Notifications();

  global.notifications = __instance;
  return __instance;
};