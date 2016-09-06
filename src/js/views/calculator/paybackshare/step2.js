// require('sass/pages/_calculator.sass');
require("../../../../../node_modules/jquery.inputmask/dist/jquery.inputmask.bundle.js");

var calculatorHelper = require("../../../helpers/calculatorHelpers");
var flyPriceFormatter = require("../../../helpers/flyPriceFormatter");
var formatPrice = calculatorHelper.formatPrice;

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/paybackshare/step2.pug'),

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

    doCalculation(e) {
        e.preventDefault();
        let maxOfMultipleReturned = 0,
            countOfMultipleReturned = 0;
        // calculate income for 10 years
        // set the first year
        this.outputData[0] = {};
        this.outputData[0].fundraise = this.model.get('raiseMoney');

        // set the second year
        this.outputData[1] = {};
        this.outputData[1].revenue = this.model.get('nextYearRevenue');

        // set all other year
        for (var i = 2; i < 11; i++) {
            this.outputData[i] = {};

            this.outputData[i].revenue = Math.ceil(this.outputData[i - 1].revenue * (1 + this.model.get('growLevel') / 100));
            this.outputData[i].annual = Math.ceil(0.05 * this.outputData[i].revenue);

            let helper = {
                sum: this.getPreviousSum(i),
                divided: this.getPreviousSum(i) / this.model.get('raiseMoney')
            };
            this.outputData[i].multiple = Math.min(parseFloat(helper.divided.toFixed(1)), 2);

            // change max value of multiple returned
            if (this.outputData[i].multiple > maxOfMultipleReturned) {
                maxOfMultipleReturned = this.outputData[i].multiple;
            }

            // skip adding maximum "multiple returned" value more then one time
            if (this.outputData[i].multiple >= 2) {
                countOfMultipleReturned++;
                if (countOfMultipleReturned > 1) {
                    this.outputData[i].multiple = "";
                }
            }

            this.outputData[i].total = Math.min(parseFloat(helper.sum.toFixed(1)), 2 * this.model.get('raiseMoney'));
        }

        // save data into the model
        this.model.saveOutputData({ outputData: this.outputData, maxOfMultipleReturned });

        // navigate to the finish step
        app.routers.navigate('/calculator/paybackshare/step-3', {trigger: true});
    },

    cutZeros(e) {
        let elem = e.target;
        elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
        elem.value = formatPrice(elem.dataset.currentValue);
    },

    // get sum of last Annual Distributions
    getPreviousSum(index) {
        let selectedRange = this.outputData.slice(2, index + 1),
            sum = 0;
        for (let row of selectedRange) {
            sum += row.annual;
        }
        return sum;
    },

    ui() {
        // get inputs by inputmask category
        this.inputPercent = this.$('[data-input-mask="percent"]');
        this.inputPrice = this.$('[data-input-mask="price"]');
    },

    render() {
        this.$el.html(this.template(this.model.toJSON()));

        // declare ui elements for the view
        this.ui();

        flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
            // save value into the model
            this.model.saveField(modelValue, +currentValue);
        });

        this.inputPercent.inputmask("9{1,4}%", {
            placeholder: "0"
        });
        return this;
    }
});