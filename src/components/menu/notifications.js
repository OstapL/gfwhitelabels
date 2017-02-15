class Notifications {
  constructor() {
    this.__socket = io(notificationsServer);
    this.attachEvents();
    this.__socket.emit('subscribe', {
      jwt: app.user.token,
      channels: ['notification'],
      "numMessagesFromArchive": 5, // 0 - use default setting. messages will be sent as arrays into appropriate channels
    });
  }

  attachEvents() {
    this.__socket.on('channel', (data) => {
      console.log(data);
    });
  }

}

module.exports = (...options) => {
  return new Notifications(...options);
};