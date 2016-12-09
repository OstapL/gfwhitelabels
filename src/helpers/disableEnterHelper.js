module.exports = {
  disableEnter(){
    this.$el.on('keypress', ':input:not(textarea)', function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
  },
};
