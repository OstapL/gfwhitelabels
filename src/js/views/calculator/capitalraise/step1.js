require('sass/pages/_calculator.sass');

var flyPriceFormatter = require("../../../helpers/flyPriceFormatter");
var formatPrice = require("../../../helpers/formatPrice");

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/step1.pug'),

    initialize() {
        // data which contains calculated income
        this.outputData = [];
    },

    events: {
        // calculate your income
        'submit .js-calc-form': 'doCalculation',

        // remove useless zeros: 0055 => 55
        'blur .js-field': 'cutZeros'
    },

    cutZeros(e) {
        let elem = e.target;
        elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
        elem.value = formatPrice(elem.dataset.currentValue);
    },

    ui() {
        // get inputs by inputmask category
        this.inputPrice = this.$('[data-input-mask="price"]');
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        // declare ui elements for the view
        this.ui();

        flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
            // save value into the model
            this.model.saveField(modelValue, currentValue);
        });

        return this;
    }
});