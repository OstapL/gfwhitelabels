import './styles/style.sass'

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
      this.fields = {
        raiseMoney: {
          required: true,
          type: 'money',
          validate: {},
        },
        nextYearRevenue: {
          required: true,
          type: 'money',
          validate: {},
        },
        growLevel: {
          required: true,
          type: 'integer',
          validate: {},
        },
      };
    },

    events: _.extend({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
      'blur [name=growLevel]': 'savePercents',
      'blur [name=raiseMoney]': 'saveMoney',
      'blur [name=nextYearRevenue]': 'saveMoney',
    }, app.helpers.calculatorValidation.events),

    validate: app.helpers.calculator.validate,
    validateForLinks: app.helpers.calculator.validateForLinks,

    saveMoney(e) {
      const value = app.helpers.format.unformatPrice(e.target.value);
      const name = e.target.getAttribute('name');
      app.cache.payBackShareCalculator[name] = Number(value);
    },

    savePercents(e) {
      const value = app.helpers.format.unformatPercent(e.target.value);
      const name = e.target.getAttribute('name');
      app.cache.payBackShareCalculator[name] = Number(value);
    },

    doCalculation(e) {
      e.preventDefault();
      if (!this.validate(e))
        return;

      let maxOfMultipleReturned = 0,
        countOfMultipleReturned = 0,
        {raiseMoney, nextYearRevenue, growLevel} = app.cache.payBackShareCalculator;

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
            this.outputData[i].annual = (function (data) {
              let sum = 0,
                length = data.length;

              for (let k = 2; k < length - 1; k++) {
                sum += data[k].annual;
              }
              return raiseMoney * 2 - sum;
            })(this.outputData);
          }
        }

        this.outputData[i].total = Math.min(parseFloat(helper.sum).toFixed(1), 2 * raiseMoney);
      }

      // save data
      app.cache.payBackShareCalculator.outputData = this.outputData;
      app.cache.payBackShareCalculator.nextYearRevenue = app.helpers.format.unformatPrice(e.target.querySelector('#nextYearRevenue').value);
      app.cache.payBackShareCalculator.maxOfMultipleReturned = maxOfMultipleReturned;

      // navigate to the finish step
      app.routers.navigate('/calculator/paybackshare/step-3', {trigger: true});
    },

    // get sum of last Annual Distributions
    getPreviousSum(index) {

      let selectedRange = this.outputData.slice(2, index + 1),
        sum = 0;

      _.each(selectedRange, (el) => {
        sum += el.annual;
      });

      return sum;
    },

    render() {
      this.$el.html(this.template({
        data: app.cache.payBackShareCalculator
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
