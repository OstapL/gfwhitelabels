const channels = ['message', 'notification', 'alert'];
let __instance = null;

class Notifications {
  constructor() {
    _.extend(this, Backbone.Events);
    this.__socket = io(notificationsServer);
    this.__attachEvents();
    this.__socket.emit('subscribe', {
      jwt: app.user.token,
      channels: ['notification'],
      "numMessagesFromArchive": 5, // 0 - use default setting. messages will be sent as arrays into appropriate channels
    });
  }

  __attachEvents() {
    _.each(channels, (channel) => {
      this.__socket.on(channel, (data) => {
        data = (data === null || typeof data[Symbol.iterator] !== 'function')
          data = [data];

        this.trigger(channel, data);
      });
    });
  }

  markAsRead(messageId) {
    this.__socket.emit('mark_read', messageId);
  }

  test() {
    let data = [{
      id: 1234,
      channel: 'notification',
      "read_flag": false,
      "time": '17:17:17',
      "user_id": 1234,
      "message": {
        text: 'this is message text',
        href: 'http:///google.com',
      },
    }];

    this.trigger('notification', data);
  }
}



module.exports = () => {
  if (!__instance)
    __instance = new Notifications();

  global.notifications = __instance;
  return __instance;
};