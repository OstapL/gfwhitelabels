module.exports = Backbone.Model.extend({
    defaults: {
        'raiseMoney': 100000,
        'nextYearRevenue': 1000000,
        'growLevel': 25,
        'outputData': null
    },
    
    saveField(modelValue, value) {
        this.set(modelValue, value);
    },

    saveOutputData({ outputData, maxOfMultipleReturned }) {
        this.set({outputData,maxOfMultipleReturned});
    }
});
