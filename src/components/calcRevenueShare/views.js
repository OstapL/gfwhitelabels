import './styles/style.sass'

const minPersents = 200;
const defaultCalculatorData = {
  raiseMoney: 0,
  nextYearRevenue: 0,
  growLevel: 0,
};

const CALCULATOR_NAME = 'RevenueShareCalculator';

const saveValue = (e) => {
  app.helpers.calculator.saveCalculatorField(CALCULATOR_NAME, e.target);
};

module.exports = {
  step1: Backbone.View.extend({
    el: '#content',

    template: require('./templates/step1.pug'),

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  }),

  step2: Backbone.View.extend(Object.assign({
    el: '#content',

    template: require('./templates/step2.pug'),

    initialize() {
      this.fields = {
        raiseMoney: {
          required: true,
          type: 'money',
        },
        nextYearRevenue: {
          required: true,
          type: 'money',
        },
        growLevel: {
          required: true,
          type: 'percent',
        },
      };
      this.listenToNavigate();
    },

    events: Object.assign({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
      'click .next': (e) => { e.preventDefault(); $('.js-calc-form').submit(); return false; },
      'blur [name=growLevel]': saveValue,
      'blur [name=raiseMoney]': saveValue,
      'blur [name=nextYearRevenue]': saveValue,
    }, app.helpers.calculatorValidation.events),

    doCalculation(e) {
      e.preventDefault();
      if (!this.validate(e)) {
        return;
      }

      const calculatorData = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      let maxOfMultipleReturned = 0;
      let countOfMultipleReturned = 0;

      const { raiseMoney, nextYearRevenue, growLevel } = calculatorData;

      const outputData = [];
        // calculate income for 10 years
      // set the first year
      outputData[0] = {};
      outputData[0].fundraise = raiseMoney;

      // set the second year
      outputData[1] = {};
      outputData[1].revenue = nextYearRevenue;

      // set all other year
      for (var i = 2; i < 11; i++) {
        outputData[i] = {};

        outputData[i].revenue = Math.ceil(outputData[i - 1].revenue * (1 + growLevel / 100));
        outputData[i].annual = Math.ceil(0.05 * outputData[i].revenue);

        const prevSum = this.getPreviousSum(outputData, i);

        let helper = {
          sum: prevSum,
          divided: prevSum / raiseMoney,
        };

        outputData[i].multiple = Math.min(parseFloat(helper.divided.toFixed(1)), 2);

        // change max value of multiple returned
        if (outputData[i].multiple > maxOfMultipleReturned) {
          maxOfMultipleReturned = outputData[i].multiple;
        }

        // skip adding maximum "multiple returned" value more then one time
        if (outputData[i].multiple >= 2) {
          countOfMultipleReturned++;
          if (countOfMultipleReturned > 1) {
            outputData[i].multiple = "";
            outputData[i].annual = "";
          } else if (countOfMultipleReturned == 1) {
            outputData[i].annual = (function (data) {
              let sum = 0,
                length = data.length;

              for (let k = 2; k < length - 1; k++) {
                sum += data[k].annual;
              }
              return raiseMoney * 2 - sum;
            })(outputData);
          }
        }

        outputData[i].total = Math.min(parseFloat(helper.sum).toFixed(1), 2 * raiseMoney);
      }

      // save data
      calculatorData.outputData = outputData;
      calculatorData.maxOfMultipleReturned = maxOfMultipleReturned;

      app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, calculatorData);

      setTimeout(() => app.routers.navigateWithReload('/calculator/revenue-share/step-3', { trigger: true }), 10);
    },

    // get sum of last Annual Distributions
    getPreviousSum(data, index) {
      let selectedRange = data.slice(2, index + 1),
        sum = 0;
      (selectedRange || []).forEach((el) => {
        sum += el.annual;
      });
      return sum;
    },

    render() {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME, defaultCalculatorData);
      this.$el.html(this.template({
        data,
      }));
      return this;
    }
  }, app.helpers.calculatorValidation.methods)),

  step3: Backbone.View.extend({
    el: '#content',

    template: require("./templates/step3.pug"),

    initialize() {
    },

    goToStep1() {
      app.routers.navigate('/calculator/revenue-share/step-2', {trigger: true});
    },

    render() {
      // disable enter to the final step of paybackshare calculator without data
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data || !data.growLevel || !data.nextYearRevenue || !data.raiseMoney) {
        setTimeout(this.goToStep1, 100);
        return this;
      }

      // get data for drawing jQPlot
      let { outputData, maxOfMultipleReturned } = data,
        lastStep = false;


      // prepare data for drawing jQPlot
      const dataRendered = function () {
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
        data,
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

        const $plot = $.plot($chart, [{
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

        $chart.on("growFinished", () => {
          //options.series.points.show = true;
          //$.plot($chart, dataArr, options);

          let last = app.utils.last($plot.getData()[0].data);
          if (last && last.length > 1) {
            let o = $plot.pointOffset({x: last[0], y: last[1]});
            if (last[1] * 100 >= minPersents) {
              $('.data-point-label').remove();
              $('<div class="data-point-label">Congratulations, Payback Share Contract is complete</div>').css({
                position: 'absolute',
                left: o.left - 500,
                top: o.top - 30,
                display: 'none'
              }).appendTo($plot.getPlaceholder()).fadeIn('slow');
            }
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

        app.helpers.calculator.bindResizeTo($plot);

      }, 'graph_chunk');

      return this;
    },


  })
};
