import './styles/style.sass'
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import lookupData from '../../helpers/capitalraiseCalculatorData';
import '../../js/graf/graf.js';
import '../../js/graf/jquery.flot.categories.js';
import '../../js/graf/jquery.flot.growraf';

if (!app.cache.establishedBusinessCalculator) {
    app.cache.establishedBusinessCalculator = {
        // 1st page
        'industry': 'Machinery',
        'raiseCash': '',
        'ownCache': '',
        'currentDebt': '',

        // 2nd page
        'revenue': '',
        'goodsCost': '',
        'operatingExpense': '',
        'oneTimeExpenses': '',
        'depreciationAmortization': '',
        'interestPaid': '',
        'taxesPaid': '',

        // 3rd page
        'revenue2': '',
        'goodsCost2': '',
        'operatingExpense2': '',
        'oneTimeExpenses2': '',
        'depreciationAmortization2': '',
        'interestPaid2': '',
        'taxesPaid2': '',

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
            // if (app.cache.establishedBusinessCalculator) {
            //     let { raiseCash, ownCache, currentDebt } = app.cache.establishedBusinessCalculator;
            //     if (!raiseCash || !ownCache || !currentDebt) {
            //         this.goToStep1();
            //         return false;
            //     }
            // } else {
            //     this.goToStep1();
            //     return false;
            // }

            this.$el.html(this.template({
                data: app.cache.establishedBusinessCalculator,
                formatPrice
            }));

            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value
                app.cache.establishedBusinessCalculator[modelValue] = +currentValue;
            });

            this.$('[data-toggle="tooltip"]').tooltip({
                html: true,
                offset: '4px 2px',
                template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
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
                {data: [[0, averageValuation]], color: '#5596c4'},
                {data: [[1, averagePs]], color: '#c0d2eb'},
                {data: [[2, averageEv]], color: '#fd9c47'},
                {data: [[3, averagePe]], color: '#fdc997'}
            ];

            // save calculated data
            _.extend(app.cache.establishedBusinessCalculator, calculatedData);

            app.routers.navigate('/calculator/establishedBusiness/finish', {trigger: true});
        },

        render: function () {
            // disable enter to the step 2 of the establishedBusiness calculator without data
            // if (app.cache.establishedBusinessCalculator) {
            //     let { revenue, goodsCost, operatingExpense, oneTimeExpenses } = app.cache.establishedBusinessCalculator,
            //         { depreciationAmortization, interestPaid, taxesPaid } = app.cache.establishedBusinessCalculator;
            //     if (!revenue || !goodsCost || !operatingExpense || !oneTimeExpenses || !depreciationAmortization ||
            //         !interestPaid || !taxesPaid) {
            //         this.goToStep2();
            //         return false;
            //     }
            // } else {
            //     this.goToStep2();
            //     return false;
            // }

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

            this.$('[data-toggle="tooltip"]').tooltip({
                html: true,
                offset: '4px 2px',
                template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
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

            let graphData = app.cache.establishedBusinessCalculator.graphData;
            let estimate = graphData[0].data[0][1];
            let data = app.cache.establishedBusinessCalculator;
            let raiseCash = data.raiseCash;

            this.$el.html(this.template({
                estimate: calculatorHelper.formatPrice(estimate),
                raise: calculatorHelper.formatPrice(raiseCash),
                offer: ((100 * raiseCash) / estimate).toFixed(2)
            }));

            this.buildGraph();

            $('body').scrollTop(0);

            return this;
        },

        buildGraph() {
            let data = app.cache.establishedBusinessCalculator.graphData;

            $.plot($("#chart"), data, {
                series: {
                    lines: {
                        fill: false
                    },
                    points: {show: false},
                    bars: {
                        show: true,
                        align: 'center',
                        barWidth: 0.6,
                        fill: 1
                    },
                    grow: {
                        active: true
                    }
                },
                xaxis: {
                    tickColor: "#eee",
                    autoscaleMargin: 0.1,
                    tickLength: 0,
                    ticks: [
                        [0, "GF Valuation"],
                        [1, "P/S"],
                        [2, "EV/EBITDA"],
                        [3, "P/E"]
                    ]
                },
                yaxis: {
                    tickColor: "#eee",
                    tickFormatter(val, axis) {
                        return formatPrice(val).replace(/\,/g, ' ');
                    }
                },
                grid: {
                    hoverable: false,
                    clickable: false,
                    tickColor: "#eee",
                    borderColor: "#eee",
                    borderWidth: 1
                }
            });
        }
    })
};
