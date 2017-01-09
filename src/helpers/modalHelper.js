const View = Backbone.View.extend({
  // el: '.global-modal',
  template: require('../templates/modal.pug'),
  events: {
    // 'click button': 'buttonClick',
    'show.bs.modal': 'modalShow',
    'shown.bs.modal': 'modalShown',
    'hide.bs.modal': 'modalHide',
    'hidden.bs.modal': 'modalHidden',
  },

  initialize(options) {
    this.__canClose = false;
  },

  render() {
    this.$el.html(this.template());

    $("#content").append(this.$el);
    this.$('.global-modal').modal('show');

    return this;
  },

  modalShow(e) {
    console.log('show.bs.modal');
  },

  modalShown(e) {
    console.log('shown.bs.modal');
  },

  modalHide(e) {
    console.log('hide.bs.modal');
    if (this._close)
      return;

    e.preventDefault();

    return false;
  },

  modalHidden(e) {
    this.undelegateEvents();
    this.remove();
    this.trigger('close', { data: 'data' });
  },

  canClose(e) {
    let $button = $(e.target).closest('button');
    this.__canClose = $button.data('dismiss') == 'modal';
    if (this.__canClose)
      this.$('.global-modal').modal('hide');
  },

});

module.exports = {
  events: {
    // 'click button': 'buttonClick',
    'show.bs.modal': 'modalShow',
    'shown.bs.modal': 'modalShown',
    'hide.bs.modal': 'modalHide',
    'hidden.bs.modal': 'modalHidden',
  },

  methods: {
    modalShow(e) {
      console.log('show.bs.modal');
    },

    modalShown(e) {
      console.log('shown.bs.modal');
    },

    modalHide(e) {
      console.log('hide.bs.modal');
      if (this.__canClose)
        return;

      e.preventDefault();

      return false;
    },

    modalHidden(e) {
      this.undelegateEvents();
      this.remove();

      let data = _.isFunction(this.getModalData) ? this.getModalData() : this.model;

      this.trigger('close', data);
    },

    closeModal(e) {
      let $button = $(e.target).closest('button');
      this.__canClose = $button.data('dismiss') == 'modal';
      if (this.__canClose)
        this.$('.modal').modal('hide');
    },
  },

  show(View, data) {
    return new Promise((resolve, reject) => {
      try {
        let view = new View(data);
        view.on('close', (data) => {
          return resolve(data);
        });
      } catch(err) {
        reject(err);
      }
    });
  },

};