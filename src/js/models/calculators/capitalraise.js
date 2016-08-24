var formatPrice = require("../../helpers/formatPrice");
var lookupData = require("../../helpers/capitalraiseCalculatorData");

let industryData = lookupData();

module.exports = Backbone.Model.extend({
    defaults: {
        'excessCash': 100000,
        'CashOnHand': 7000,
        'projectedRevenue': 500000,
        'projectedRevenueTwo': 5000000,
        'firstYearExpenses': 350000,
        'operatingProfit': 10000,
        'operatingProfitTwo': 1500000,
        'yourDebt': 50000,
        'cashRaise': 1000000,

        // select boxes
        'industry': 'Food Products',
        'industryEstablishment': 'New and potentially growing quickly',
        'typeOfEstablishment': 'Be an improvement to what is currently on the market',

        // data that will be calculated
        'ntmPs': null,
        'ntmEv': null,
        'year1Ps': null,
        'year1Ev': null,
        'year1Average': null,
        'year1Npv': null,
        'year2Ps': null,
        'year2Ev': null,
        'year2Average': null,
        'year2Npv': null,

        // flag that data is calculated
        'dataIsFilled': false
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
            'operatingProfitFormatted': formatPrice(this.get('operatingProfit')),
            'operatingProfitTwoFormatted': formatPrice(this.get('operatingProfitTwo')),
            'yourDebtFormatted': formatPrice(this.get('yourDebt')),
            'cashRaiseFormatted': formatPrice(this.get('cashRaise'))
        });
        return this;
    },

    calculate() {
        let industry = this.get('industry'),
            row = industryData.find(el => el[0] == industry),
            ntmPs = row[5],
            ntmEv = row[6];

        // save NTM
        this.set({ntmPs, ntmEv});

        this.set({
            year1Ps: ntmPs * this.get('projectedRevenue')
        });
    }
});
