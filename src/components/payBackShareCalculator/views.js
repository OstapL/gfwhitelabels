// require('./styles/style.sass');
const Calculator = require('./calculator.js');

const minPersents = 200;

module.exports = {
  step1: Backbone.View.extend({
    el: '#content',

    template: require('./templates/step1.pug'),

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  }),

  step2: Backbone.View.extend(_.extend({
    el: '#content',
    template: require('./templates/step2.pug'),
    events: _.extend({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
      'blur [name=growLevel]': 'savePercents'
    }, app.helpers.calculatorValidation.events),

    initialize() {
      this.fields = {
        raiseMoney: {
          required: true,
          type: 'money',
          fn(name, fn, attr, data, schema) {
            const value = this.getData(data, name);
            if (value <= 0)
              throw 'Please, enter positive number';
          },
        },
        nextYearRevenue: {
          required: true,
          type: 'money',
          fn(name, fn, attr, data, schema) {
            const value = this.getData(data, name);
            if (value <= 0)
              throw 'Please, enter positive number';
          },
        },
        growLevel: {
          required: true,
          type: 'percent',
          fn(name, fn, attr, data, schema) {
            const value = this.getData(data, name);
            if (value <= 0)
              throw 'Please, enter positive number';
          },
        },
      };
    },

    validate: app.helpers.calculator.validate,
    validateForLinks: app.helpers.calculator.validateForLinks,

    doCalculation(e) {
      e.preventDefault();

      if (!this.validate(e))
        return;

      const $form = $(e.target).closest('form');
      const data = $form.serializeJSON();

      let processedData = Calculator.doCalculation(this.fields, data);
      if (!processedData)
        return false;

      app.cache.payBackShareCalculator = _.extend(data, processedData);

      // navigate to the finish step
      app.routers.navigate('/calculator/paybackshare/step-3', {trigger: true});
    },

    render() {
      this.$el.html(this.template({
        data: app.cache.payBackShareCalculator || {},
      }));

      return this;
    }
  }, app.helpers.calculatorValidation.methods)),

  step3: Backbone.View.extend({
    el: '#content',

    template: require("./templates/step3.pug"),

    initialize() {
      this.jQPlot = null;
      // $(window).on("resize", $.proxy(this.resizeJqPlot, this));
    },

    resizeJqPlot: function () {
      if (!this.jQPlot) return;
      this.jQPlot.replot({
        resetAxes: true,
        legend: {
          show: false
        },
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
        let {growLevel, nextYearRevenue, raiseMoney} = app.cache.payBackShareCalculator;
        if (!growLevel || !nextYearRevenue || !raiseMoney) {
          this.goToStep1();
          return false;
        }
      } else {
        this.goToStep1();
        return false;
      }

      // get data for drawing jQPlot
      let {outputData, maxOfMultipleReturned} = app.cache.payBackShareCalculator,
        lastStep = false;


      // prepare data for drawing jQPlot
      let dataRendered = function () {
        let data = [];
        let hasNotEmpty = false;
        for (let i = 0, size = outputData.length; i < size; i++) {
          if (outputData[i].multiple) {
            data.push([i, outputData[i].multiple]);
            hasNotEmpty = true;
          } else {
            if (!hasNotEmpty) {
              data.push([i, 0]);
            }
          }
        }
        return data;
      };


      this.$el.html(this.template({
        data: app.cache.payBackShareCalculator,
        dataRendered: dataRendered(),
      }));

      let currentYear = new Date().getFullYear(),
        ticks = [];

      for (var i = 0; i < 11; i++) {
        ticks.push([i, ' ' + (currentYear + i)]);
      }


      let $chart = $("#chart1");

      require.ensure([
        'src/js/graph/graph.js',
        'src/js/graph/jquery.flot.growraf',
      ], (require) => {
        require('src/js/graph/graph.js');
        require('src/js/graph/jquery.flot.growraf');

        var plotApi = $.plot($chart, [{
          data: dataRendered(),
          animator: {start: 0, steps: 100, duration: 500, direction: "right", lines: true},
          label: "Invested amount",
          lines: {
            lineWidth: 1
          },
          shadowSize: 0
        }], {
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
              show: true,
              radius: 3,
              lineWidth: 1
            },
            shadowSize: 2,
            grow: {
              active: true,
              growings: [{
                reanimate: "continue",
                stepDirection: "up",
                stepMode: "linear",
                valueIndex: 1
              }]

            }
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
            min: 0,
            max: 10,
            ticks,
            tickSize: 1,
            tickDecimals: 0,
            tickColor: "#eee",
            mode: "categories"
          },
          yaxis: {
            ticks: [[0, '0%'], [1, '100%'], [2, '200%'], [3, '300%']],
            tickSize: 1,
            tickDecimals: 0,
            tickColor: "#eee"
          }
        });

        $chart.on("growFinished", function () {
          //options.series.points.show = true;
          //$.plot($chart, dataArr, options);

          let last = plotApi.getData()[0].data.pop();
          let o = plotApi.pointOffset({x: last[0], y: last[1]});
          if (last[1] * 100 >= minPersents) {
            $('<div class="data-point-label">Congratulations, Payback Share Contract is complete</div>').css({
              position: 'absolute',
              left: o.left - 500,
              top: o.top - 30,
              display: 'none'
            }).appendTo(plotApi.getPlaceholder()).fadeIn('slow');
          }
        });

        $("<div id='flot-tooltip'></div>").css({
          position: "absolute",
          display: "none",
          border: "1px solid #fdd",
          padding: "2px",
          "background-color": "#fee",
          opacity: 0.80
        }).appendTo("body");

        $chart.bind("plothover", function (event, pos, item) {
          let $flotTooltip = $("#flot-tooltip");
          if (item) {
            var datapoint = item.datapoint,
              x = datapoint[0] + currentYear,
              y = datapoint[1] * 100;

            $flotTooltip.html(`${y}%, Year ${x}`);
            $flotTooltip.css({top: item.pageY - 35, left: item.pageX - $flotTooltip.outerWidth(true) / 2})
              .fadeIn(200);
          } else {
            $flotTooltip.hide();
          }
        });
      }, 'graph_chunk');

      return this;
    }
  })
};
