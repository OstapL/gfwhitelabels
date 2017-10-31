// import './styles/style.sass'
//import 'jquery.inputmask/dist/jquery.inputmask.bundle.js';

const minPersents = 200;

module.exports = {
  calculator: Backbone.View.extend(Object.assign({
    el: '#revenue-share-calculator',
    template: require('./templates/calculator/calculator.pug'),
    events: Object.assign({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
    }, app.helpers.calculatorValidation.events),

    initialize() {
      // data which contains calculated income
      this.data = {
        raiseMoney: 0,
        nextYearRevenue: 0,
        growLevel: 0,
        outputData: Array(10).fill().map((_, i) => [i, 0]),
      };

      this.fields = {
        raiseMoney: {
          required: true,
          type: 'money',
          label: 'How much is the company raising?'
        },
        nextYearRevenue: {
          required: true,
          type: 'money',
          label: 'What do you expect next year\'s revenue share to be?',
        },
        growLevel: {
          required: true,
          type: 'percent',
          label: 'At what rate do you expect revenues to grow each year?',
        },
      };
    },

    doCalculation(e) {
      e.preventDefault();

      if (!this.validate(e))
        return;

      app.analytics.emitEvent(app.analytics.events.CalculatorUsed, app.user.stats);
      const filterNumberRx = /[^0-9\.]/g;
      this.data.raiseMoney = Number(this.$raiseMoney.val().replace(filterNumberRx, ''));
      this.data.nextYearRevenue = Number(this.$nextYearRevenue.val().replace(filterNumberRx, ''));
      this.data.growLevel = Number(this.$growLevel.val().replace(filterNumberRx, ''));

      let maxOfMultipleReturned = 0,
        countOfMultipleReturned = 0,
        { raiseMoney, nextYearRevenue, growLevel } = this.data;

      let outputData = [];
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

        let helper = {
          sum: this.getPreviousSum(outputData, i),
          divided: this.getPreviousSum(outputData, i) / raiseMoney
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
            outputData[i].annual = (function(data) {
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

      this.data.outputData = outputData;
      this.initPlot();
      
    },

    // get sum of last Annual Distributions
    getPreviousSum(outputData, index) {

      let selectedRange = outputData.slice(2, index + 1),
        sum = 0;
      (selectedRange || []).forEach((el) => {
        sum += el.annual;
      });

      return sum;
    },

    initPlot() {
      require.ensure([
        'src/js/graph/graph.js',
        'src/js/graph/jquery.flot.growraf',
      ], () => {
        require('src/js/graph/graph.js');
        require('src/js/graph/jquery.flot.growraf');

        this.disposePlot();

        let currentYear = new Date().getFullYear();
        let ticks = Array(10).fill().map((_, i) => [i, + (currentYear + i)]);
        let data = this.mapToPlot(this.data.outputData);

        this.$chart = $("#chart1");

        this.$plot = $.plot(this.$chart, [{
          data: data,
          animator: { start: 0, steps: 100, duration: 500, direction: "right", lines: true },
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

        app.helpers.calculator.bindResizeTo(this.$plot);

        this.$chart.on('growFinished', () => {
          //options.series.points.show = true;
          //$.plot(this.$chart, dataArr, options);

          let plotData = this.$plot.getData();
          let last = app.utils.last(plotData[0].data);
          if (last && last.length > 1) {
            let o = this.$plot.pointOffset({x: last[0], y: last[1]});
            if (last[1] * 100 >= minPersents) {
              $('.data-point-label').remove();

              $('<div class="data-point-label">Congratulations, Payback Share Contract is complete</div>').css({
                position: 'absolute',
                left: o.left - 500,
                top: o.top - 30,
                display: 'none'
              }).appendTo(this.$plot.getPlaceholder()).fadeIn('slow');
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

        this.$chart.bind("plothover", function (event, pos, item) {
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

        var scrollTop = $('#revenue-share-calculator-result').offset().top;
        $(document).scrollTop(scrollTop - 50);
      }, 'graph_chunk');

      return this;
    },

    disposePlot() {
      if (!this.$chart || !this.$chart.length)
        return;

      this.$chart
        .off('growFinished')
        .off('plothover');

      this.$plot.shutdown();
      this.$chart.empty();
      this.$chart = null;
    },

    mapToPlot(data) {
      let notEmpty = false;

      return (data || []).map((item, idx) => {
        if (item.multiple) {
          notEmpty = true;
          return [idx, item.multiple];
        }

        if (notEmpty)
          return null;

        return [idx, 0];
      }).filter(item => !!item);
    },

    render() {
      this.$el.html(this.template({
        data: this.data,
      }));

      this.initPlot();

      this.$raiseMoney = this.$('input[name=raiseMoney]');
      this.$nextYearRevenue = this.$('input[name=nextYearRevenue]');
      this.$growLevel = this.$('input[name=growLevel]');

      return this;
    },

    destroy() {
      app.helpers.calculator.unbindResizeFrom(this.$plot);
      this.disposePlot();
      this.undelegateEvents();
      this.$el.removeData().unbind();

      this.$el.empty();
    },

  }, app.helpers.calculatorValidation.methods)),
};
