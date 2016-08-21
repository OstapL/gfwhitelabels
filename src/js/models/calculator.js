var formatPrice = require("../helpers/formatPrice");

module.exports = Backbone.Model.extend({
    defaults: {
        'raiseMoney': 100000,
        'nextYearRevenue': 1000000,
        'growLevel': 25,
        'outputData': null
    },

    initialize() {
        this.setFormattedPrice();
    },
    
    saveField(modelValue, value) {
        this.set(modelValue, value);
    },

    saveOutputData({ outputData, maxOfMultipleReturned }) {
        this.set({outputData,maxOfMultipleReturned});
    },

    setFormattedPrice() {
        this.set({
            'raiseMoneyFormatted': formatPrice(this.get('raiseMoney')),
            'nextYearRevenueFormatted': formatPrice(this.get('nextYearRevenue'))
        });
    }
});
