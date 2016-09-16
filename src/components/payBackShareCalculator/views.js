import './styles/style.sass'
import 'jquery.inputmask/dist/jquery.inputmask.bundle.js';
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import '../../js/graf/graf.js';
import '../../js/graf/jquery.flot.animator.js';
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
                    'raiseMoney': '',
                    'nextYearRevenue': '',
                    'growLevel': ''
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
                        this.outputData[i].annual = "";
                    } else if (countOfMultipleReturned == 1) {
                        this.outputData[i].annual = (function(data) {
                            let sum = 0,
                                length = data.length;

                            for (let k = 2; k < length - 1; k++) {
                                sum += data[k].annual;
                            }
                            return raiseMoney * 2 - sum;
                        })(this.outputData);
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
                sum += +row.annual;
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
            // $(window).on("resize", $.proxy(this.resizeJqPlot, this));
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
        
        goToStep1() {
            app.routers.navigate('/calculator/paybackshare/step-2', {trigger: true});
        },

        render() {
            // disable enter to the final step of paybackshare calculator without data
            if (app.cache.payBackShareCalculator) {
                let { growLevel, nextYearRevenue, raiseMoney } = app.cache.payBackShareCalculator;
                if (!growLevel || !nextYearRevenue || !raiseMoney) {
                    this.goToStep1();
                    return false;
                }
            } else {
                this.goToStep1();
                return false;
            }

            // get data for drawing jQPlot
            let { outputData, maxOfMultipleReturned } = app.cache.payBackShareCalculator,
                lastStep = false;


            // prepare data for drawing jQPlot
            let dataRendered = function() {
                let data = [];
                for (let i = 0, size = outputData.length; i < size; i++) {
                    if (outputData[i].multiple) {
                        data.push([i, outputData[i].multiple]);

                        // give the ability to draw one more step
                        // if (outputData[i].multiple >= maxOfMultipleReturned) {
                        //     lastStep = true;
                        // }

                        // if we reach max needed steps, stop the filling
                        // if (lastStep) {
                        //     let lastElement = data[0].pop();
                        //     lastElement[2] = 'Congratulations, Payback Share Contract is complete';
                        //     data[0].push(lastElement);
                        //     break;
                        // }

                    }
                }
                return data;
            };


            this.$el.html(this.template({
                data: app.cache.payBackShareCalculator,
                dataRendered: dataRendered(),
                formatPrice
            }));

            let $chart = $("#chart1"),
                dataArr = [{
                    data: dataRendered(),
                    animator: { start: 0, steps: 99, duration: 500, direction: "right", lines: true },
                    label: "Invested amount",
                    lines: {
                        lineWidth: 1
                    },
                    shadowSize: 0
                }],
                options = {
                    series: {
                        lines: {
                            show: !0,
                            lineWidth: 2,
                            fill: !0,
                            fillColor: {
                                colors: [{
                                    opacity: .05
                                }, {
                                    opacity: .01
                                }]
                            }
                        },
                        points: {
                            show: false,
                            radius: 3,
                            lineWidth: 1
                        },
                        shadowSize: 2
                    },
                    grid: {
                        hoverable: !0,
                        clickable: !0,
                        tickColor: "#eee",
                        borderColor: "#eee",
                        borderWidth: 1
                    },
                    colors: ["#d12610", "#37b7f3", "#52e136"],
                    xaxis: {
                        max: 10,
                        ticks: 11,
                        tickDecimals: 0,
                        tickColor: "#eee"
                    },
                    yaxis: {
                        ticks: 11,
                        tickDecimals: 0,
                        tickColor: "#eee"
                    }
                };

            var plotApi = $.plotAnimator($chart, dataArr, options);

            $chart.on("animatorComplete", function() {
                options.series.points.show = true;
                $.plot($chart, dataArr, options);
                
                let last = plotApi.getData()[0].data.pop();
                let o = plotApi.pointOffset({x: last[0], y: last[1]});
                $('<div class="data-point-label">Congratulations, Payback Share Contract is complete</div>').css( {
                    position: 'absolute',
                    left: o.left - 200,
                    top: o.top - 30,
                    display: 'none'
                }).appendTo(plotApi.getPlaceholder()).fadeIn('slow');
            });

            // drawing jQPlot
            // this.jQPlot = $.jqplot('chart1', {
            //     seriesColors: ["red"],
            //     title: 'Payback Graph',
            //     animate: true,
            //     dataRenderer: dataRendered,
            //     seriesDefaults: {
            //         // fill: true,
            //         markerOptions: {
            //             show: true
            //         },
            //         rendererOptions: {
            //             smooth: false
            //         },
            //         pointLabels: {
            //             show: true,
            //             location: 'ne',
            //             ypadding: 3
            //         }
            //     },
            //     grid: {
            //         background: 'rgba(57,57,57,0.0)',
            //         drawBorder: false,
            //         shadow: false,
            //         gridLineColor: '#efefef',
            //         gridLineWidth: 1
            //     },
            //     series: [
            //         {
            //             lineWidth: 1,
            //             color: 'red',
            //             markerOptions:{style:'circle'},
            //             showLine: true,
            //             fillAndStroke: true,
            //             fill: true,
            //             fillColor: '#c9302c',
            //             fillAlpha: 0.2
            //         }
            //     ],
            //     axes: {
            //         xaxis: {
            //             min: 0,
            //             max: 10,
            //             tickInterval: 1,
            //             label: 'Years'
            //         },
            //         yaxis: {
            //             min: 0,
            //             max: 2.5,
            //             tickInterval: 0.5,
            //             label: 'Multiple Returned',
            //             labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            //         }
            //     },
            //     highlighter: {
            //         show: true,
            //         sizeAdjust: 6
            //     },
            //     cursor: {
            //         show: false
            //     }
            // });

            return this;
        }
    })
};
