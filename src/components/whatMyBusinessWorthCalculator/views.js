import './styles/style.sass'
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import 'bootstrap-slider/dist/bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'

let formatPrice = calculatorHelper.formatPrice;

module.exports = {
    intro: Backbone.View.extend({
        el: '#content',

        template: require('./templates/intro.pug'),

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    }),

    step1: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step1.pug'),

        initialize() {
            if (!app.cache.whatMyBusinessWorthCalculator) {
                app.cache.whatMyBusinessWorthCalculator = {
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
                    'annualInterest': 2500
                }
            }
        },

        events: {
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
            this.bootstrapSlider = this.$('.js-bootstrap-slider');
        },

        render: function () {
            this.$el.html(this.template({
                data: app.cache.whatMyBusinessWorthCalculator,
                formatPrice
            }));
            

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.whatMyBusinessWorthCalculator[modelValue] = +currentValue;
            });

            // bootstrap slider
            this.bootstrapSlider.each(function() {
                $(this).bootstrapSlider ({
                    min: 0,
                    max: 100
                }).on('slideStop', function(slider) {
                    let key = slider.target.dataset.modelValue;
                    app.cache.whatMyBusinessWorthCalculator[key] = +slider.value;
                });
            });
            
            return this; 
        }
    }),

    step2: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step2.pug'),

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation',

            // remove useless zeros: 0055 => 55
            'blur .js-field': 'cutZeros'
        },
        doCalculation(e) {
            e.preventDefault();

            // "Baseline Capital Needs" calculations
            this.calculateWithDelta();

            // "50% over Baseline Capital Needs" calculations
            this.calculateWithDelta('overBaseline');

            let data = app.cache.whatMyBusinessWorthCalculator;

            // calculate final amount of raise
            data.finalRaiseAmount = Math.round(data.raiseAmount > data.raiseAmount2 ? data.raiseAmount : data.raiseAmount2);

            app.routers.navigate('/calculator/whatmybusinessworth/finish', {trigger: true});
        },

        calculateWithDelta(type = 'default') {
            let data = app.cache.whatMyBusinessWorthCalculator,
                calculatedData = {},
            // convert values into percents
                grossMargin = data.grossMargin / 100,
                workingCapital = data.workingCapital / 100,
                taxRate = data.taxRate / 100;

            // calculate "Gross Profit" and "Operating Expenses"
            let delta = type == 'overBaseline' ? 1.5 : 1,
                addValue = type == 'overBaseline' ? data.additionalOperating : 0,
                finalKey = type == 'overBaseline' ? 'raiseAmount2' : 'raiseAmount';

            _.extend(calculatedData, {
                grossProfitYear1: Math.round(grossMargin * data.projectedRevenueYear * delta),
                grossProfitYear2: Math.round(grossMargin * data.projectedRevenueTwoYears * delta),
                operatingExpensesYear1: (data.monthlyOperatingYear + addValue) * 12,
                operatingExpensesYear2: (data.monthlyOperatingTwoYears + addValue) * 12
            });

            // calculate "Operating Profit"
            _.extend(calculatedData, {
                operatingProfitYear1: calculatedData.grossProfitYear1 - calculatedData.operatingExpensesYear1,
                operatingProfitYear2: calculatedData.grossProfitYear2 - calculatedData.operatingExpensesYear2
            });

            // calculate "Pre-Tax Profit"
            _.extend(calculatedData, {
                preTaxProfitYear1: calculatedData.operatingProfitYear1 - data.annualInterest,
                preTaxProfitYear2: calculatedData.operatingProfitYear2 - data.annualInterest
            });

            // calculate "Taxes"
            _.extend(calculatedData, {
                taxesYear1: taxRate * calculatedData.preTaxProfitYear1,
                taxesYear2: taxRate * calculatedData.preTaxProfitYear2
            });

            // calculate "Net Income"
            _.extend(calculatedData, {
                netIncomeYear1: calculatedData.preTaxProfitYear1 - calculatedData.taxesYear1,
                netIncomeYear2: calculatedData.preTaxProfitYear2 - calculatedData.taxesYear2
            });

            // calculate "Working Capital Needs"
            _.extend(calculatedData, {
                workingCapitalNeedsYear1: workingCapital * data.projectedRevenueYear * delta,
                workingCapitalNeedsYear2: workingCapital * data.projectedRevenueTwoYears * delta
            });

            // calculate "Total Cash Generated"
            _.extend(calculatedData, {
                totalCashGeneratedYear1: calculatedData.netIncomeYear1 - calculatedData.workingCapitalNeedsYear1 - data.capitalExpenditures,
                totalCashGeneratedYear2: calculatedData.netIncomeYear2 - calculatedData.workingCapitalNeedsYear2
            });

            // calculate "Additional Cash Needed"
            _.extend(calculatedData, {
                addCashNeeded1Year1: data.excessCash - data.ownCache - calculatedData.totalCashGeneratedYear1,
                addCashNeeded1Year2: calculatedData.totalCashGeneratedYear2 > 0 ? 0 : -calculatedData.totalCashGeneratedYear2
            });


            // calculate "The Amount You Should Raise"
            calculatedData[finalKey] = calculatedData.addCashNeeded1Year1 + calculatedData.addCashNeeded1Year2;

            // save calculated data
            _.extend(app.cache.whatMyBusinessWorthCalculator, calculatedData);
        },

        isFirstStepFilled() {
            if (app.cache.whatMyBusinessWorthCalculator) {
                let { excessCash, ownCache, projectedRevenueYear, projectedRevenueTwoYears, grossMargin, monthlyOperatingYear } = app.cache.whatMyBusinessWorthCalculator,
                    valid = false;

                if (excessCash && ownCache && projectedRevenueYear &&
                    projectedRevenueTwoYears && grossMargin && monthlyOperatingYear) {
                    valid = true;
                }
                return valid;
            } else {
                return false;
            }
        },

        cutZeros(e) {
            let elem = e.target;
            elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
            elem.value = formatPrice(elem.dataset.currentValue);
        },

        ui() {
            // get inputs by inputmask category
            this.inputPrice = this.$('[data-input-mask="price"]');
            this.bootstrapSlider = this.$('.js-bootstrap-slider');
        },

        render: function () {
            // disable enter to the step 2 of capitalraise calculator without data entered on the first step
            if (!this.isFirstStepFilled()) {
                app.routers.navigate('/calculator/whatmybusinessworth/step-1', {trigger: true});
                return false;
            }

            this.$el.html(this.template({
                data: app.cache.whatMyBusinessWorthCalculator,
                formatPrice
            }));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.whatMyBusinessWorthCalculator[modelValue] = +currentValue;
            });

            // bootstrap slider
            this.bootstrapSlider.each(function() {
                $(this).bootstrapSlider({
                    min: 0,
                    max: 100
                }).on('slideStop', function(slider) {
                    let key = slider.target.dataset.modelValue;
                    app.cache.whatMyBusinessWorthCalculator[key] = +slider.value;
                });
            });

            $('body').scrollTop(0);

            return this;
        }
    }),

    finish: Backbone.View.extend({
        el: '#content',

        template: require('./templates/finish.pug'),

        render: function () {
            // disable enter to the final step of whatmybusinessworth calculator without data
            if (!app.cache.whatMyBusinessWorthCalculator) {
                app.routers.navigate('/calculator/whatmybusinessworth/step-1', {trigger: true});
                return false;
            }

            this.$el.html(this.template({
                data: app.cache.whatMyBusinessWorthCalculator,
                formatPrice
            }));

            $('body').scrollTop(0);

            return this;
        }
    })
};
