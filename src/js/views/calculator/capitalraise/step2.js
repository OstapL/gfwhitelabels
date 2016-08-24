require('sass/pages/_calculator.sass');

var formatPrice = require("../../../helpers/formatPrice");

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/step2.pug'),

    initialize() {},

    events: {
        // calculate your income
        'submit .js-calc-form': 'doCalculation'
    },

    ui() {},
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        // declare ui elements for the view
        this.ui();
        
        

        return this;
    }
});