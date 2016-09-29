// import './styles/style.sass'
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import lookupData from '../../helpers/capitalraiseCalculatorData';

let formatPrice = calculatorHelper.formatPrice;
let industryData = lookupData();

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
            if (!app.cache.capitalRaiseCalculator) {
                app.cache.capitalRaiseCalculator = {
                    'excessCash': '',
                    'CashOnHand': '',
                    'projectedRevenue': '',
                    'projectedRevenueTwo': '',
                    'firstYearExpenses': '',
                    'operatingProfit': '',
                    'operatingProfitTwo': '',
                    'yourDebt': '',
                    'cashRaise': '',
                    'liquidityAdjustment': 0, // 0 %

                    // select boxes
                    'industry': 'Machinery',

                    // 'New and potentially growing quickly' - 1
                    // 'Fairly well established' - 2
                    'industryEstablishment': 1,

                    // 'Be an improvement to what is currently on the market' - 3
                    // 'Be revolutionary and disruptive to the market' - 4
                    'typeOfEstablishment': 4
                }
            }

            // declare data for two selects
            this.industryEstablishment = [
                {
                    text: 'New and potentially growing quickly',
                    value: 1
                },
                {
                    text: 'Fairly well established',
                    value: 2
                }
            ];
            this.typeOfEstablishment = [
                {
                    text: 'Be an improvement to what is currently on the market',
                    value: 3
                },
                {
                    text: 'Be revolutionary and disruptive to the market',
                    value: 4
                }
            ];

            // helper for template
            this.selects = {
                industryEstablishment: this.industryEstablishment,
                typeOfEstablishment: this.typeOfEstablishment
            }
        },

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation',

            'change .js-select': 'saveValue'
        },

        saveValue(e) {
            let selectBox = e.target;
            app.cache.capitalRaiseCalculator[selectBox.dataset.modelValue] = selectBox.value;
        },

        doCalculation(e) {
            e.preventDefault();
            let data = app.cache.capitalRaiseCalculator,
                calculatedData = {},
                industry = data.industry,
                row = industryData[industry],
                ntmPs = row[4],
                ntmEv = row[5];

            // calculate NTM and post capital raise
            _.extend(calculatedData, {
                ntmPs,
                ntmEv,
                postCapitalRaise: data.CashOnHand - data.yourDebt + data.cashRaise
            });
            // calculate P/S and EV/EBIT for year1 and year5
            _.extend(calculatedData, {
                year1Ps: ntmPs * data.projectedRevenue,
                year1Ev: ntmEv * data.operatingProfit + calculatedData.postCapitalRaise,
                year5Ps: ntmPs * data.projectedRevenueTwo + calculatedData.postCapitalRaise,
                year5Ev: ntmEv * data.operatingProfitTwo + calculatedData.postCapitalRaise
            });

            // calculate Average for year1 and year5
            _.extend(calculatedData, {
                year1Average: (calculatedData.year1Ps + calculatedData.year1Ev) / 2,
                year5Average: (calculatedData.year5Ps + calculatedData.year5Ev) / 2
            });

            // calculate NPV for year1 and year5
            _.extend(calculatedData, {
                year1Npv: calculatedData.year1Average,
                year5Npv: calculatedData.year5Average / Math.pow(1.1, 4)
            });

            // calculate average NPV
            calculatedData.averageNPV = (calculatedData.year1Npv + calculatedData.year5Npv) / 2;

            // calculate Liquidity-Adjusted Average NPV
            calculatedData.liquidityAdjustmentAverageNPV = calculatedData.averageNPV / (1 - data.liquidityAdjustment);

            // calculate probability of failure (depends on Industry/Product Permutation)
            let mathHelper = {
                '2:3':  0.3,
                '2:4': 0.5,
                '1:3': 0.5,
                '1:4': 0.7
            };
            let failure = mathHelper[data.industryEstablishment + ':' + data.typeOfEstablishment];
            calculatedData.probabilityOfFailure = failure;

            // calculate GrowthFountain Recommended Pre Money Valuation
            calculatedData.PreMoneyValuation = Math.ceil(calculatedData.liquidityAdjustmentAverageNPV / (1 + calculatedData.probabilityOfFailure))

            // save calculated data
            _.extend(app.cache.capitalRaiseCalculator, calculatedData);

            app.routers.navigate('/calculator/capitalraise/finish', {trigger: true});
        },

        ui() {
            // get inputs by inputmask category
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        render: function () {
            this.$el.html(this.template({
                data: app.cache.capitalRaiseCalculator,
                industryData: Object.keys(industryData),
                selects: this.selects,
                formatPrice
            }));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.capitalRaiseCalculator[modelValue] = +currentValue;
            });

            return this;
        }
    }),

    finish: Backbone.View.extend({
        el: '#content',

        template: require('./templates/finish.pug'),

        render: function () {
            // disable enter to the final step of capitalraise calculator without data
            if (!app.cache.capitalRaiseCalculator) {
                app.routers.navigate('/calculator/capitalraise/step-1', {trigger: true});
                return false;
            }

            this.$el.html(this.template({
                data: app.cache.capitalRaiseCalculator,
                formatPrice
            }));

            $('body').scrollTop(0);

            return this;
        }
    })
}