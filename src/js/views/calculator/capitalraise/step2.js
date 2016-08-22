require('sass/pages/_calculator.sass');

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/step2.pug'),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});