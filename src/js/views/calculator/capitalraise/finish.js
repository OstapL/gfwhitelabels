require('sass/pages/_calculator.sass');

var calculatorHelper = require("../../../helpers/calculatorHelpers");
var formatPrice = calculatorHelper.formatPrice;

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/finish.pug'),

    render: function () {
        this.$el.html(this.template({
            model: this.model.toJSON(),
            formatPrice
        }));
        return this;
    }
});