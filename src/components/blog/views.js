module.exports = {
  list: Backbone.View.extend(_.extend({
    el: '#content',
    template: require('./templates/list.pug'),
    events: _.extend({
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

  detail: Backbone.View.extend(_.extend({
    el: '#content',
    template: require('./templates/detail.pug'),
    events: _.extend({
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

  createEdit: Backbone.View.extend(_.extend({
    el: '#content',
    template: require('./templates/createEdit.pug'),
    events: _.extend({
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
