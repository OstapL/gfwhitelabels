const channels = ['general'];

class Notifications {

  constructor(io) {
    Object.assign(this, Backbone.Events);
    this.__socket = io(app.config.notificationsServer);
    this.__socket.on('connect', () => {
      this.__socket.emit('subscribe', {
        jwt: app.user.token,
        channels,
        numMessagesFromArchive: 0,
      });
    });
    this.__attachEvents();
  }

  __attachEvents() {
    channels.forEach((channel) => {
      this.__socket.on(channel, (data) => {
        if (data === null || typeof data[Symbol.iterator] !== 'function')
          data = [data];
        this.trigger(channel, data);
      });
    });
  }

  markAsRead(messageId) {
    this.__socket.emit('markRead', messageId);
  }

}

let __instance = null;

module.exports = {
  getInstanceAsync() {
    return new Promise((resolve, reject) => {
      if (__instance)
        return resolve(__instance);

      require.ensure(['socket.io-client'], (require) => {
        __instance = new Notifications(require('socket.io-client'));
        resolve(__instance);
      }, 'socket.io_chunk');
    });
  }
};