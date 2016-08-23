var formatPrice = require("../../helpers/formatPrice");

module.exports = Backbone.Model.extend({
    defaults: {
        'excessCash': 100000,
        'CashOnHand': 1000000,
        'projectedRevenue': 25000,
        'projectedRevenueTwo': 21000,
        'slider': null,
        'firstYearExpenses': 350000,
        'secondYearExpenses': 285000,
        'annualExpenses': 350000,
        'capitalExpenditures': 80000,
        'annualInterestExpense': 7000000,
        
        'outputData': null
    },

    saveField(modelValue, value) {
        this.set(modelValue, value);
    },

    saveOutputData({ outputData, maxOfMultipleReturned }) {
        this.set({outputData,maxOfMultipleReturned});
    },

    setFormattedPrice() {
        this.set({
            'excessCashFormatted': formatPrice(this.get('excessCash')),
            'CashOnHandFormatted': formatPrice(this.get('CashOnHand')),
            'projectedRevenueFormatted': formatPrice(this.get('projectedRevenue')),
            'projectedRevenueTwoFormatted': formatPrice(this.get('projectedRevenueTwo')),
            'firstYearExpensesFormatted': formatPrice(this.get('firstYearExpenses')),
            'annualExpensesFormatted': formatPrice(this.get('annualExpenses')),
            'secondYearExpensesFormatted': formatPrice(this.get('secondYearExpenses')),
            'capitalExpendituresFormatted': formatPrice(this.get('capitalExpenditures')),
            'annualInterestExpenseFormatted': formatPrice(this.get('annualInterestExpense'))
        });
        return this;
    }
});
