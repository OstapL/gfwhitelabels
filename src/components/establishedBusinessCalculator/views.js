import './styles/style.sass'
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import lookupData from '../../helpers/capitalraiseCalculatorData';
import '../../js/graf/graf.js';
import '../../js/graf/jquery.flot.categories.js';


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
            if (!app.cache.establishedBusinessCalculator) {
                app.cache.establishedBusinessCalculator = {
                    // 1st page
                    'industry': 'Machinery',
                    'raiseCash': 250000,
                    'ownCache': 30000,
                    'currentDebt': 200000,

                    // 2nd page
                    'revenue': 750000,
                    'goodsCost': 200000,
                    'operatingExpense': 150000,
                    'oneTimeExpenses': 10000,
                    'depreciationAmortization': 30000,
                    'interestPaid': 10000,
                    'taxesPaid': 30000,

                    // 3rd page
                    'revenue2': 800000,
                    'goodsCost2': 225000,
                    'operatingExpense2': 150000,
                    'oneTimeExpenses2': 25000,
                    'depreciationAmortization2': 35000,
                    'interestPaid2': 10000,
                    'taxesPaid2': 30000,

                    // calculations
                    'grossprofit': null,
                    'grossprofit2': null,
                    'totalExpenses': null,
                    'totalExpenses2': null,
                    'ebit': null,
                    'ebit2': null,
                    'ebittda': null,
                    'ebittda2': null,
                    'preTaxIncome': null,
                    'preTaxIncome2': null,
                    'netIncome': null,
                    'netIncome2': null,

                    // data for the graph on the final page
                    'graphData': null
                };
            }
        },

        events: {
            'change .js-select': 'saveValue'
        },

        saveValue(e) {
            let selectBox = e.target;
            app.cache.establishedBusinessCalculator[selectBox.dataset.modelValue] = selectBox.value;
        },

        ui() {
            // get inputs by inputmask category
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        render: function () {
            this.$el.html(this.template({
                data: app.cache.establishedBusinessCalculator,
                industryData: Object.keys(industryData),
                formatPrice
            }));

            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.establishedBusinessCalculator[modelValue] = +currentValue;
            });

            $('body').scrollTop(0);

            return this;
        }
    }),

    step2: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step2.pug'),

        ui() {
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        goToStep1() {
            app.routers.navigate('/calculator/establishedBusiness/step-1', {trigger: true});
        },

        render: function () {
            // disable enter to the step 2 of the establishedBusiness calculator without data
            if (app.cache.establishedBusinessCalculator) {
                let { raiseCash, ownCache, currentDebt } = app.cache.establishedBusinessCalculator;
                if (!raiseCash || !ownCache || !currentDebt) {
                    this.goToStep1();
                    return false;
                }
            } else {
                this.goToStep1();
                return false;
            }

            this.$el.html(this.template({
                data: app.cache.establishedBusinessCalculator,
                formatPrice
            }));

            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.establishedBusinessCalculator[modelValue] = +currentValue;
            });

            $('body').scrollTop(0);

            return this;
        }
    }),

    step3: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step3.pug'),

        goToStep2() {
            app.routers.navigate('/calculator/establishedBusiness/step-2', {trigger: true});
        },

        ui() {
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation'
        },

        doCalculation(e) {
            e.preventDefault();
            let data = app.cache.establishedBusinessCalculator,
                calculatedData = {},
                industry = data.industry,
                row = industryData[industry],
                ntmPs = row[4],
                ltmPs = row[1],
                ntmEv = row[5],
                ltmEv = row[2],
                ntmPe = row[3],
                ltmPe = row[0],
                liquidityDiscount = 0.2;

            _.extend(calculatedData, {
                grossprofit: data.revenue - data.goodsCost,
                grossprofit2: data.revenue2 - data.goodsCost2,
                totalExpenses: data.operatingExpense + data.oneTimeExpenses,
                totalExpenses2: data.operatingExpense2 + data.oneTimeExpenses2
            });

            _.extend(calculatedData, {
                ebit: calculatedData.grossprofit - data.operatingExpense + data.oneTimeExpenses,
                ebit2: calculatedData.grossprofit2 - data.operatingExpense2 + data.oneTimeExpenses2
            });

            _.extend(calculatedData, {
                ebittda: calculatedData.ebit + data.depreciationAmortization,
                ebittda2: calculatedData.ebit2 + data.depreciationAmortization2,
                preTaxIncome: calculatedData.ebit - data.interestPaid,
                preTaxIncome2: calculatedData.ebit2 - data.interestPaid2
            });

            _.extend(calculatedData, {
                netIncome: calculatedData.preTaxIncome - data.taxesPaid,
                netIncome2: calculatedData.preTaxIncome2 - data.taxesPaid2
            });

            let percents = calculatedData.netIncome2 / calculatedData.netIncome - 1;

            // calculate enterprise value
            let ntmPsEnterprise = ntmPs * data.revenue2,
                ltmPsEnterprise = ltmPs * data.revenue,
                ntmEvEnterprise = ntmEv * calculatedData.ebittda2,
                ltmEvEnterprise = ltmEv * calculatedData.ebittda,
                ntmPeEnterprise = ntmPe * calculatedData.netIncome2,
                ltmPeEnterprise = ltmPe * calculatedData.netIncome;

            let ntmEnterpriseValuation = (ntmPsEnterprise + ntmEvEnterprise + ntmPeEnterprise) / 3,
                ltmEnterpriseValuation = (ltmPsEnterprise + ltmEvEnterprise + ltmPeEnterprise) / 3;


            // calculate equity value
            let ntmEvEquity = ntmEvEnterprise + data.ownCache - data.currentDebt,
                ltmEvEquity = ltmEvEnterprise + data.ownCache - data.currentDebt;

            let ntmEquityValuation = (ntmPsEnterprise + ntmEvEquity + ntmPeEnterprise) / 3,
                ltmEquityValuation = (ltmPsEnterprise + ltmEvEquity + ltmPeEnterprise) / 3;


            // calculate (factors in Issuer's estimate of growth)
            let ntmPsDiscount = ntmPsEnterprise * (1 - liquidityDiscount),
                ltmPsDiscount = ltmPsEnterprise * (1 - liquidityDiscount),
                ntmEvDiscount = ntmEvEquity * (1 - liquidityDiscount),
                ltmEvDiscount = ltmEvEquity * (1 - liquidityDiscount),
                ntmPeDiscount = ntmPeEnterprise * (1 - liquidityDiscount),
                ltmPeDiscount = ltmPeEnterprise * (1 - liquidityDiscount);

            let ntmDiscountValuation = (ntmPsDiscount + ntmEvDiscount + ntmPeDiscount) / 3,
                ltmDiscountValuation = (ltmPsDiscount + ltmEvDiscount + ltmPeDiscount) / 3;


            // calculate Average
            let averageValuation = Math.round((ntmDiscountValuation + ltmDiscountValuation) / 2),
                averagePs = Math.round((ntmPsDiscount + ltmPsDiscount) / 2),
                averageEv = Math.round((ntmEvDiscount + ltmEvDiscount) / 2),
                averagePe = Math.round((ntmPeDiscount + ltmPeDiscount) / 2);

            // prepare data for the graph
            calculatedData.graphData = [
                ["GF Valuation", averageValuation],
                ["P/S", averagePs],
                ["EV/EBITDA", averageEv],
                ["P/E", averagePe]
            ];

            // save calculated data
            _.extend(app.cache.establishedBusinessCalculator, calculatedData);

            app.routers.navigate('/calculator/establishedBusiness/finish', {trigger: true});
        },

        render: function () {
            // disable enter to the step 2 of the establishedBusiness calculator without data
            if (app.cache.establishedBusinessCalculator) {
                let { revenue, goodsCost, operatingExpense, oneTimeExpenses } = app.cache.establishedBusinessCalculator,
                    { depreciationAmortization, interestPaid, taxesPaid } = app.cache.establishedBusinessCalculator;
                if (!revenue || !goodsCost || !operatingExpense || !oneTimeExpenses || !depreciationAmortization ||
                    !interestPaid || !taxesPaid) {
                    this.goToStep2();
                    return false;
                }
            } else {
                this.goToStep2();
                return false;
            }

            this.$el.html(this.template({
                data: app.cache.establishedBusinessCalculator,
                formatPrice
            }));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.establishedBusinessCalculator[modelValue] = +currentValue;
            });

            return this;
        }
    }),

    finish: Backbone.View.extend({
        el: '#content',

        template: require('./templates/finish.pug'),

        goToStep3() {
            app.routers.navigate('/calculator/establishedBusiness/step-3', {trigger: true});
        },

        render: function () {
            // disable enter to the final step of the establishedBusiness calculator without data
            if (app.cache.establishedBusinessCalculator) {
                if (!app.cache.establishedBusinessCalculator.graphData) {
                    this.goToStep3();
                    return false;
                }
            } else {
                this.goToStep3();
                return false;
            }

            this.$el.html(this.template());

            this.buildGraph();

            $('body').scrollTop(0);

            return this;
        },

        buildGraph() {
            let data = app.cache.establishedBusinessCalculator.graphData;

            $.plot("#chart", [{
                data: data,
                animator: { start: 0, steps: 99, duration: 500, direction: "right", lines: true },
                lines: {
                    lineWidth: 1
                },
                shadowSize: 0
            }], {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.5,
                        align: "center",
                        fillColor: "#79b7da"
                    }
                },
                grid: {
                    hoverable: false,
                    clickable: false,
                    tickColor: "#eee",
                    borderColor: "#eee",
                    borderWidth: 1
                },
                colors: ["#79b7da"],
                xaxis: {
                    mode: "categories",
                    tickLength: 0,
                    tickColor: "#eee",
                    autoscaleMargin: 0.1
                },
                yaxis: {
                    tickColor: "#eee",
                    tickFormatter(val, axis) {
                        return formatPrice(val).replace(/\,/g, ' ');
                        console.log('val, axis', val, axis);
                    }
                }
            });
        }
    })
};
