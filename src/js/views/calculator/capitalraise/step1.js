require('sass/pages/_calculator.sass');

var calculatorHelper = require("../../../helpers/calculatorHelpers");
var flyPriceFormatter = require("../../../helpers/flyPriceFormatter");
var lookupData = require("../../../helpers/capitalraiseCalculatorData");
var formatPrice = calculatorHelper.formatPrice;

let industryData = lookupData();

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/step1.pug'),

    events: {
        // calculate your income
        'submit .js-calc-form': 'doCalculation',

        // remove useless zeros: 0055 => 55
        'blur .js-field': 'cutZeros',
        
        'change .js-select': 'saveValueIntoTheModel'
    },

    saveValueIntoTheModel(e) {
        let selectBox = e.target;
        this.model.saveField(selectBox.dataset.modelValue, selectBox.value);
    },

    doCalculation(e) {
        e.preventDefault();

        this.model.calculate();

        app.routers.navigate('/calculator/capitalraise/step-2', {trigger: true});
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
        this.$el.html(this.template({
            model: this.model.toJSON(),
            industryData: industryData.map(el => el[0])
        }));

        // declare ui elements for the view
        this.ui();

        flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
            // save value into the model
            this.model.saveField(modelValue, currentValue);
        });

        return this;
    }
});