var calculatorHelper = require("../../helpers/calculatorHelpers");
var formatPrice = calculatorHelper.formatPrice;
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
        'industry': 'Machinery',

        // 'New and potentially growing quickly' - 1
        // 'Fairly well established' - 2
        'industryEstablishment': 1,

        // 'Be an improvement to what is currently on the market' - 3
        // 'Be revolutionary and disruptive to the market' - 4
        'typeOfEstablishment': 4,

        // data that will be calculated
        'ntmPs': null,
        'ntmEv': null,
        'year1Ps': null,
        'year1Ev': null,
        'year1Average': null,
        'year1Npv': null,
        'year5Ps': null,
        'year5Ev': null,
        'year5Average': null,
        'year5Npv': null,
        'postCapitalRaise': null,
        'averageNPV': null,
        'liquidityAdjustment': 0, // 0 %
        'liquidityAdjustmentAverageNPV': null,
        'probabilityOfFailure': null,
        'PreMoneyValuation': null,

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
            row = industryData[industry],
            ntmPs = row[4],
            ntmEv = row[5];

        // calculate NTM and post capital raise
        this.set({
            ntmPs,
            ntmEv,
            postCapitalRaise: this.get('CashOnHand') - this.get('yourDebt') + this.get('cashRaise'),
            dataIsFilled: true
        });

        // calculate P/S and EV/EBIT for year1 and year5
        this.set({
            year1Ps: ntmPs * this.get('projectedRevenue'),
            year1Ev: ntmEv * this.get('operatingProfit') + this.get('postCapitalRaise'),
            year5Ps: ntmPs * this.get('projectedRevenueTwo') + this.get('postCapitalRaise'),
            year5Ev: ntmEv * this.get('operatingProfitTwo') +this.get('postCapitalRaise')
        });

        // calculate Average for year1 and year5
        this.set({
            year1Average: (this.get('year1Ps') + this.get('year1Ev')) / 2,
            year5Average: (this.get('year5Ps') + this.get('year5Ev')) / 2
        });

        // calculate NPV for year1 and year5
        this.set({
            year1Npv: this.get('year1Average'),
            year5Npv: this.get('year5Average') / Math.pow(1.1, 4)
        });

        // calculate average NPV
        this.set('averageNPV', (this.get('year1Npv') + this.get('year5Npv')) / 2);
        
        // calculate Liquidity-Adjusted Average NPV
        this.set({
            'liquidityAdjustmentAverageNPV': this.get('averageNPV') / (1 - this.get('liquidityAdjustment'))
        });

        // calculate probability of failure (depends on Industry/Product Permutation)
        this.probabilityOfFailure();
        
        // calculate GrowthFountain Recommended Pre Money Valuation
        this.set({
            'PreMoneyValuation': Math.ceil(this.get('liquidityAdjustmentAverageNPV') / (1 + this.get('probabilityOfFailure')))
        });
    },

    probabilityOfFailure() {
        const mathHelper = {
            '2:3':  0.3,
            '2:4': 0.5,
            '1:3': 0.5,
            '1:4': 0.7
        };
        let failure = mathHelper[this.get('industryEstablishment') + ':' + this.get('typeOfEstablishment')];
        this.set('probabilityOfFailure', failure);
    }
});
