module.exports = {
  list: Backbone.View.extend(Object.assign({
    el: '#content',
    template: require('./templates/list.pug'),
    events: Object.assign({
    }),

    initialize(options) {
    },

    render() {
      this.el.innerHTML = 
        this.template({
          values: this.model.data,
          count: this.model.count,
        });
      return this;
    },

  })),

  detail: Backbone.View.extend(Object.assign({
    el: '#content',
    template: require('./templates/detail.pug'),
    events: Object.assign({
    }),

    initialize(options) {
    },

    render() {
      this.el.innerHTML = 
        this.template({
          values: this.model,
        });
      return this;
    },

  })),

  createEdit: Backbone.View.extend(Object.assign({
    el: '#content',
    template: require('./templates/createEdit.pug'),
    events: Object.assign({
    }),

    initialize(options) {
    },

    render() {
      this.el.innerHTML = 
        this.template({
          values: this.model,
        });
      return this;
    },
  })),

};
