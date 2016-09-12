import './styles/style.sass'
import 'jquery.inputmask/dist/jquery.inputmask.bundle.js';
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
/*
import 'js/jqplot/jquery.jqplot.js';
import 'jqplot/plugins/jqplot.highlighter.js';
import 'jqplot/plugins/jqplot.canvasTextRenderer.js';
import 'jqplot/plugins/jqplot.canvasAxisLabelRenderer.js';
import 'jqplot/plugins/jqplot.pointLabels.js';
*/


const formatPrice = calculatorHelper.formatPrice;

module.exports = {
    step1: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step1.pug'),

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    }),

    step2: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step2.pug'),

        initialize() {
            // data which contains calculated income
            this.outputData = [];

            if (!app.cache.payBackShareCalculator) {
                app.cache.payBackShareCalculator = {
                    'raiseMoney': 100000,
                    'nextYearRevenue': 1000000,
                    'growLevel': 25
                };
            }
        },

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation',

            // remove useless zeros: 0055 => 55
            'blur .js-field': 'cutZeros'
        },

        doCalculation(e) {
            e.preventDefault();
            let maxOfMultipleReturned = 0,
                countOfMultipleReturned = 0,
                { raiseMoney, nextYearRevenue, growLevel } = app.cache.payBackShareCalculator;

            // calculate income for 10 years
            // set the first year
            this.outputData[0] = {};
            this.outputData[0].fundraise = raiseMoney;

            // set the second year
            this.outputData[1] = {};
            this.outputData[1].revenue = nextYearRevenue;

            // set all other year
            for (var i = 2; i < 11; i++) {
                this.outputData[i] = {};

                this.outputData[i].revenue = Math.ceil(this.outputData[i - 1].revenue * (1 + growLevel / 100));
                this.outputData[i].annual = Math.ceil(0.05 * this.outputData[i].revenue);

                let helper = {
                    sum: this.getPreviousSum(i),
                    divided: this.getPreviousSum(i) / raiseMoney
                };
                this.outputData[i].multiple = Math.min(parseFloat(helper.divided.toFixed(1)), 2);

                // change max value of multiple returned
                if (this.outputData[i].multiple > maxOfMultipleReturned) {
                    maxOfMultipleReturned = this.outputData[i].multiple;
                }

                // skip adding maximum "multiple returned" value more then one time
                if (this.outputData[i].multiple >= 2) {
                    countOfMultipleReturned++;
                    if (countOfMultipleReturned > 1) {
                        this.outputData[i].multiple = "";
                    }
                }

                this.outputData[i].total = Math.min(parseFloat(helper.sum.toFixed(1)), 2 * raiseMoney);
            }

            // save data
            app.cache.payBackShareCalculator.outputData = this.outputData;
            app.cache.payBackShareCalculator.maxOfMultipleReturned = maxOfMultipleReturned;

            // navigate to the finish step
            app.routers.navigate('/calculator/paybackshare/step-3', {trigger: true});
        },

        cutZeros(e) {
            let elem = e.target;
            elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
            elem.value = formatPrice(elem.dataset.currentValue);

            // save percent values
            if (elem.dataset.inputMask == "percent") {
                app.cache.payBackShareCalculator[elem.dataset.modelValue] = elem.dataset.currentValue;
            }
        },

        // get sum of last Annual Distributions
        getPreviousSum(index) {
            let selectedRange = this.outputData.slice(2, index + 1),
                sum = 0;
            for (let row of selectedRange) {
                sum += row.annual;
            }
            return sum;
        },

        ui() {
            // get inputs by inputmask category
            this.inputPercent = this.$('[data-input-mask="percent"]');
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        render() {
            this.$el.html(this.template({
                data: app.cache.payBackShareCalculator,
                formatPrice
            }));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                app.cache.payBackShareCalculator[modelValue] = +currentValue;
            });

            this.inputPercent.inputmask("9{1,4}%", {
                placeholder: "0"
            });
            return this;
        }
    }),

    step3: Backbone.View.extend({
        el: '#content',

        template: require("./templates/step3.pug"),

        initialize() {
            this.jQPlot = null;
            $(window).on("resize", $.proxy(this.resizeJqPlot, this));
        },

        resizeJqPlot: function() {
            if (!this.jQPlot) return;
            this.jQPlot.replot({
                resetAxes: true,
                axes: {
                    xaxis: {
                        min: 0,
                        max: 10,
                        tickInterval: 1,
                        label: 'Years'
                    },
                    yaxis: {
                        min: 0,
                        max: 2.5,
                        tickInterval: 0.5,
                        label: 'Multiple Returned',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    }
                }
            });
        },

        render() {
            // disable enter to the final step of paybackshare calculator without data
            if (!app.cache.payBackShareCalculator) {
                app.routers.navigate('/calculator/paybackshare/step-2', {trigger: true});
                return false;
            }

            this.$el.html(this.template({
                model: app.cache.payBackShareCalculator,
                formatPrice
            }));

            // get data for drawing jQPlot
            let { outputData, maxOfMultipleReturned } = app.cache.payBackShareCalculator,
                lastStep = false;


            // prepare data for drawing jQPlot
            let dataRendered = function() {
                let data = [[]];
                for (let i = 0, size = outputData.length; i < size; i++) {
                    if (outputData[i].multiple) {
                        data[0].push([i, outputData[i].multiple, '']);

                        // give the ability to draw one more step
                        if (outputData[i].multiple >= maxOfMultipleReturned) {
                            lastStep = true;
                        }

                        // if we reach max needed steps, stop the filling
                        if (lastStep) {
                            let lastElement = data[0].pop();
                            lastElement[2] = 'Congratulations, Payback Share Contract is complete';
                            data[0].push(lastElement);
                            break;
                        }

                    }
                }
                return data;
            };


            // drawing jQPlot
            this.jQPlot = $.jqplot('chart1', {
                seriesColors: ["red"],
                title: 'Payback Graph',
                animate: true,
                dataRenderer: dataRendered,
                seriesDefaults: {
                    // fill: true,
                    markerOptions: {
                        show: true
                    },
                    rendererOptions: {
                        smooth: false
                    },
                    pointLabels: {
                        show: true,
                        location: 'ne',
                        ypadding: 3
                    }
                },
                grid: {
                    background: 'rgba(57,57,57,0.0)',
                    drawBorder: false,
                    shadow: false,
                    gridLineColor: '#efefef',
                    gridLineWidth: 1
                },
                series: [
                    {
                        lineWidth: 1,
                        color: 'red',
                        markerOptions:{style:'circle'},
                        showLine: true,
                        fillAndStroke: true,
                        fill: true,
                        fillColor: '#c9302c',
                        fillAlpha: 0.2
                    }
                ],
                axes: {
                    xaxis: {
                        min: 0,
                        max: 10,
                        tickInterval: 1,
                        label: 'Years'
                    },
                    yaxis: {
                        min: 0,
                        max: 2.5,
                        tickInterval: 0.5,
                        label: 'Multiple Returned',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    }
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 6
                },
                cursor: {
                    show: false
                }
            });

            return this;
        }
    })
};
