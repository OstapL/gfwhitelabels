require("../../../jqplot/jquery.jqplot.js");
require("../../../jqplot/plugins/jqplot.highlighter.js");
require("../../../jqplot/plugins/jqplot.canvasTextRenderer.js");
require("../../../jqplot/plugins/jqplot.canvasAxisLabelRenderer.js");
require("../../../jqplot/plugins/jqplot.pointLabels.js");
var calculatorHelper = require("../../../helpers/calculatorHelpers");
var formatPrice = calculatorHelper.formatPrice;

module.exports = Backbone.View.extend({
    el: '#content',

    template: require("templates/calculator/paybackshare/step3.pug"),

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
        this.$el.html(this.template({
            model: this.model.toJSON(),
            formatPrice
        }));

        // get data for drawing jQPlot
        let outputData = this.model.get('outputData'),
            maxOfMultipleReturned = this.model.get('maxOfMultipleReturned'),
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
});
