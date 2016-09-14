module.exports = { 
  form: Backbone.View.extend({
    template: require('./templates/form.pug'),
    render() {
      this.$el.html(
        this.template({model: this.model})
      )
    },
  }),

  list: Backbone.View.extend({
    template: require('./templates/list.pug'),

    render() {
      console.log('this', this);
      this.$el.html(
        this.template({comments: this.collection})
      )
      return this;
    },

  }),

  detail: Backbone.View.extend({
    template: require('./templates/detail.pug'),

    getHtml() {
      return this.template({model: this.model})
    },

    render() {
      this.$el.html(
        this.template({model: this.model})
      )
      return this;
    },

  }),
};
