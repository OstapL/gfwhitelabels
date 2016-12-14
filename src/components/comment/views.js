module.exports = { 
  form: Backbone.View.extend({
    template: require('./templates/form.pug'),

    getHtml(data) {
      return this.template(data)
    },

    render() {
      this.$el.html(
        this.template({model: this.model})
      )
    },

  }),

  list: Backbone.View.extend({
    template: require('./templates/list.pug'),

    render() {
      this.$el.html(
        this.template({
          app: app,
          company: this.model,
          comments: this.collection,
        })
      )
      return this;
    },

  }),

  detail: Backbone.View.extend({
    template: require('./templates/detail.pug'),

    events: {

    },

    initialize(options) {

    },

    getHtml(data) {
      return this.template(data)
    },

    render() {
      this.$el.html(
        this.template({
          model: this.model,
          app: app,
        })
      );

      return this;
    },

  }),


  comments: Backbone.View.extend({
    urlRoot: commentsServer + '/:model/:id',
    template: require('./templates/comments.pug'),
    el: '.comments',
    events: {

    },

    initialize(options) {
      this.fields = options.fields;
      this.urlRoot = this.urlRoot.replace(':model', 'company').replace(':id', this.model.id);
    },

    render() {
      this.$el.html(this.template(this.model));

      return this;
    },

  }),
};
