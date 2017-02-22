const io = require('socket.io-client');
const channels = ['general'];

let __instance = null;

class Notifications {

  constructor() {
    _.extend(this, Backbone.Events);
    this.__socket = io(notificationsServer);
    this.__socket.on('connect', () => {
      this.__socket.emit('subscribe', {
        jwt: app.user.token,
        channels: channels,
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
        console.log('Data from websocket');
        console.log(data);
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

  return __instance;
};