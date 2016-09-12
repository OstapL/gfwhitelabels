import calculatorHelper from '../../helpers/calculatorHelpers';

let formatPrice = calculatorHelper.formatPrice;

module.exports = Backbone.Model.extend({
    defaults: {
        'excessCash': 75000,
        'ownCache': 25000,
        'projectedRevenueYear': 400000,
        'projectedRevenueTwoYears': 550000,
        'grossMargin': 55, // 55%
        'monthlyOperatingYear': 12000,
        'monthlyOperatingTwoYears': 14000,
        'workingCapital': 18, // 18%
        'additionalOperating': 7200,
        'capitalExpenditures': 27500,
        'taxRate': 22, // 22%
        'annualInterest': 2500,

        // data that will be calculated
        'grossProfitYear1': null,
        'grossProfitYear2': null,
        'operatingExpensesYear1': null,
        'operatingExpensesYear2': null,
        'operatingProfitYear1': null,
        'operatingProfitYear2': null,
        'preTaxProfitYear1': null,
        'preTaxProfitYear2': null,
        'taxesYear1': null,
        'taxesYear2': null,
        'netIncomeYear1': null,
        'netIncomeYear2': null,
        'workingCapitalNeedsYear1': null,
        'workingCapitalNeedsYear2': null,
        'totalCashGeneratedYear1': null,
        'totalCashGeneratedYear2': null,
        'addCashNeeded1Year1': null,
        'addCashNeeded1Year2': null,
        'raiseAmount': null,
        'raiseAmount2': null,
        'finalRaiseAmount': null,

        // flag that data is calculated
        'dataIsFilled': false
    },

    saveField(modelValue, value) {
        this.set(modelValue, value);
    },

    setFormattedPrice() {
        this.set({
            'excessCashFormatted': formatPrice(this.get('excessCash')),
            'ownCacheFormatted': formatPrice(this.get('ownCache')),
            'projectedRevenueYearFormatted': formatPrice(this.get('projectedRevenueYear')),
            'projectedRevenueTwoYearsFormatted': formatPrice(this.get('projectedRevenueTwoYears')),
            'grossMarginFormatted': formatPrice(this.get('grossMargin')),
            'monthlyOperatingYearFormatted': formatPrice(this.get('monthlyOperatingYear')),
            'monthlyOperatingTwoYearsFormatted': formatPrice(this.get('monthlyOperatingTwoYears')),
            'additionalOperatingFormatted': formatPrice(this.get('additionalOperating')),
            'capitalExpendituresFormatted': formatPrice(this.get('capitalExpenditures')),
            'annualInterestFormatted': formatPrice(this.get('annualInterest'))
        });
        return this;
    },

    calculate() {
        // "Baseline Capital Needs" calculations
        this.calculateWithDelta();

        // "50% over Baseline Capital Needs" calculations
        this.calculateWithDelta('overBaseline');

        // calculate final amount of raise
        this.set('finalRaiseAmount', this.get('raiseAmount') > this.get('raiseAmount2') ? this.get('raiseAmount') : this.get('raiseAmount2'));
        this.set('dataIsFilled', true);
        app.cache.whatmybusiness = this.toJSON();
    },

    // calculate "Baseline Capital Needs" regarding on type
    calculateWithDelta(type = 'default') {
        // convert values into percents
        let grossMargin = this.get('grossMargin') / 100,
            workingCapital = this.get('workingCapital') / 100,
            taxRate = this.get('taxRate') / 100;

        // calculate "Gross Profit" and "Operating Expenses"
        let delta = type == 'overBaseline' ? 1.5 : 1,
            addValue = type == 'overBaseline' ? this.get('additionalOperating') : 0,
            finalKey = type == 'overBaseline' ? 'raiseAmount2' : 'raiseAmount';

        this.set({
            grossProfitYear1: Math.round(grossMargin * this.get('projectedRevenueYear') * delta),
            grossProfitYear2: Math.round(grossMargin * this.get('projectedRevenueTwoYears') * delta),
            operatingExpensesYear1: (this.get('monthlyOperatingYear') + addValue) * 12,
            operatingExpensesYear2: (this.get('monthlyOperatingTwoYears') + addValue) * 12
        });

        // calculate "Operating Profit"
        this.set({
            operatingProfitYear1: this.get('grossProfitYear1') - this.get('operatingExpensesYear1'),
            operatingProfitYear2: this.get('grossProfitYear2') - this.get('operatingExpensesYear2')
        });

        // calculate "Pre-Tax Profit"
        let annualInterest = this.get('annualInterest');
        this.set({
            preTaxProfitYear1: this.get('operatingProfitYear1') - annualInterest,
            preTaxProfitYear2: this.get('operatingProfitYear2') - annualInterest
        });

        // calculate "Taxes"
        this.set({
            taxesYear1: taxRate * this.get('preTaxProfitYear1'),
            taxesYear2: taxRate * this.get('preTaxProfitYear2')
        });

        // calculate "Net Income"
        this.set({
            netIncomeYear1: this.get('preTaxProfitYear1') - this.get('taxesYear1'),
            netIncomeYear2: this.get('preTaxProfitYear2') - this.get('taxesYear2')
        });

        // calculate "Working Capital Needs"
        this.set({
            workingCapitalNeedsYear1: workingCapital * this.get('projectedRevenueYear') * delta,
            workingCapitalNeedsYear2: workingCapital * this.get('projectedRevenueTwoYears') * delta
        });

        // calculate "Total Cash Generated"
        this.set({
            totalCashGeneratedYear1: this.get('netIncomeYear1') - this.get('workingCapitalNeedsYear1') - this.get('capitalExpenditures'),
            totalCashGeneratedYear2: this.get('netIncomeYear2') - this.get('workingCapitalNeedsYear2')
        });

        // calculate "Additional Cash Needed"
        this.set({
            addCashNeeded1Year1: this.get('excessCash') - this.get('ownCache') - this.get('totalCashGeneratedYear1'),
            addCashNeeded1Year2: this.get('totalCashGeneratedYear2') > 0 ? 0 : -this.get('totalCashGeneratedYear2')
        });

        // calculate "The Amount You Should Raise"
        this.set(finalKey, this.get('addCashNeeded1Year1') + this.get('addCashNeeded1Year2'));
    }
});
