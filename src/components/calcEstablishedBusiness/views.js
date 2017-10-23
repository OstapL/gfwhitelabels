import './styles/style.sass'

const CALCULATOR_NAME = 'EstablishedBusinessCalculator';

const defaultCalculatorData = {
  // 1st page
  industry: 'Machinery',
  raiseCash: 0,
  ownCache: 0,
  currentDebt: 0,

  // 2nd page
  revenue: '',
  goodsCost: '',
  operatingExpense: '',
  oneTimeExpenses: '',
  depreciationAmortization: '',
  interestPaid: '',
  taxesPaid: '',

  // 3rd page
  revenue2: '',
  goodsCost2: '',
  operatingExpense2: '',
  oneTimeExpenses2: '',
  depreciationAmortization2: '',
  interestPaid2: '',
  taxesPaid2: '',

  // calculations
  grossprofit: null,
  grossprofit2: null,
  totalExpenses: null,
  totalExpenses2: null,
  ebit: null,
  ebit2: null,
  ebittda: null,
  ebittda2: null,
  preTaxIncome: null,
  preTaxIncome2: null,
  netIncome: null,
  netIncome2: null,

  // data for the graph on the final page
  graphData: null,
};

//TODO: it is reasonable to add validation on each step

const checkStep1Data = (data) => {
  return {
    industry: 'Machinery',
    raiseCash: 0,
    ownCache: 0,
    currentDebt: 0,
  }
};

const checkStep2Data = (data) => {
  return {
    // 2nd page
    revenue: '',
    goodsCost: '',
    operatingExpense: '',
    oneTimeExpenses: '',
    depreciationAmortization: '',
    interestPaid: '',
    taxesPaid: '',
  };
};

const checkStep3Data = (data) => {
  return {// 3rd page
    revenue2: '',
    goodsCost2: '',
    operatingExpense2: '',
    oneTimeExpenses2: '',
    depreciationAmortization2: '',
    interestPaid2: '',
    taxesPaid2: '',}
};

const checkCalculations = (data) => {
  return {
    // calculations
    grossprofit: null,
    grossprofit2: null,
    totalExpenses: null,
    totalExpenses2: null,
    ebit: null,
    ebit2: null,
    ebittda: null,
    ebittda2: null,
    preTaxIncome: null,
    preTaxIncome2: null,
    netIncome: null,
    netIncome2: null,
  }
};

const checkFinishData = (data) => {
  return {
    graphData: null,
  }
};

const industryData = app.helpers.capitalraiseData();

const saveValue = (e) => {
  app.helpers.calculator.saveCalculatorField(CALCULATOR_NAME, e.target);
};

module.exports = {
  intro: Backbone.View.extend({
    el: '#content',

    template: require('./templates/intro.pug'),

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  }),

  step1: Backbone.View.extend(Object.assign({
    el: '#content',

    template: require('./templates/step1.pug'),

    events: Object.assign({
      'change select': saveValue,
      'blur [type=money]': saveValue,
      'submit form': 'nextStep',
    }, app.helpers.calculatorValidation.events),

    initialize() {
      this.fields = {
        raiseCash: {
          required: true,
          type: 'integer',
          validate: {},
        },
        ownCache: {
          required: true,
          type: 'integer',
          validate: {},
        },
        currentDebt: {
          required: true,
          type: 'integer',
          validate: {},
        },
      };

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data.industry) {
        data.industry = 'Machinery';
        app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, data);
      }

      this.listenToNavigate();
    },

    nextStep(e) {
      e.preventDefault();

      if (!this.validate(e)) {
        return;
      }

      app.routers.navigate('/calculator/established-business/step-2', {trigger: true});
    },

    render: function () {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME, defaultCalculatorData);

      this.$el.html(this.template({
        data,
        industryData: Object.keys(industryData),
      }));

      $('body').scrollTop(0);

      return this;
    }
  }, app.helpers.calculatorValidation.methods)),

  step2: Backbone.View.extend(Object.assign({
    el: '#content',

    template: require('./templates/step2.pug'),

    events: Object.assign({
      'submit form': 'nextStep',
      'blur [type=money]': saveValue,
    }, app.helpers.calculatorValidation.events),

    initialize(options) {
      this.fields = {
        revenue: {
          required: true,
          type: 'integer',
          validate: {},
        },
        goodsCost: {
          required: true,
          type: 'integer',
          validate: {},
        },
        operatingExpense: {
          required: true,
          type: 'integer',
          validate: {},
        },
        oneTimeExpenses: {
          required: true,
          type: 'integer',
          validate: {},
        },
        depreciationAmortization: {
          required: true,
          type: 'integer',
          validate: {},
        },
        interestPaid: {
          required: true,
          type: 'integer',
          validate: {},
        },
        taxesPaid: {
          required: true,
          type: 'integer',
          validate: {},
        },
      };
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      this.$('[data-toggle="tooltip"]').tooltip('dispose');
    },

    nextStep(e) {
      e.preventDefault();

      if (!this.validate(e)) {
        return;
      }

      app.routers.navigate('/calculator/established-business/step-3', {trigger: true});
    },

    goToStep1() {
      app.routers.navigate('/calculator/established-business/step-1', {trigger: true});
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

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME, defaultCalculatorData);

      this.$el.html(this.template({
        data,
      }));

      this.$('[data-toggle="tooltip"]').tooltip({
        html: true,
        offset: '4px 2px',
        template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });

      $('body').scrollTop(0);

      return this;
    }
  }, app.helpers.calculatorValidation.methods)),

  step3: Backbone.View.extend(Object.assign({
    el: '#content',

    template: require('./templates/step3.pug'),

    initialize() {
      this.fields = {
        revenue2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        goodsCost2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        operatingExpense2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        oneTimeExpenses2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        depreciationAmortization2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        interestPaid2: {
          required: true,
          type: 'integer',
          validate: {},
        },
        taxesPaid2: {
          required: true,
          type: 'integer',
          validate: {},
        },
      };
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      this.$('[data-toggle="tooltip"]').tooltip('dispose');
    },

    goToStep2() {
      app.routers.navigate('/calculator/established-business/step-2', {trigger: true});
    },

    events: Object.assign({
      // calculate your income
      'blur [type=money]': saveValue,
      'submit .js-calc-form': 'doCalculation',
      'click .next': (e) => { e.preventDefault(); $('.js-calc-form').submit(); return false; },
    }, app.helpers.calculatorValidation.events),

    doCalculation(e) {
      e.preventDefault();

      if (!this.validate(e)) {
        return;
      }

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);

      let calculatedData = {},
        industry = data.industry,
        row = industryData[industry],
        ntmPs = row[4],
        ltmPs = row[1],
        ntmEv = row[5],
        ltmEv = row[2],
        ntmPe = row[3],
        ltmPe = row[0],
        liquidityDiscount = 0.2;

      Object.assign(calculatedData, {
        grossprofit: data.revenue - data.goodsCost,
        grossprofit2: data.revenue2 - data.goodsCost2,
        totalExpenses: data.operatingExpense + data.oneTimeExpenses,
        totalExpenses2: data.operatingExpense2 + data.oneTimeExpenses2
      });

      Object.assign(calculatedData, {
        ebit: calculatedData.grossprofit - data.operatingExpense + data.oneTimeExpenses,
        ebit2: calculatedData.grossprofit2 - data.operatingExpense2 + data.oneTimeExpenses2
      });

      Object.assign(calculatedData, {
        ebittda: calculatedData.ebit + data.depreciationAmortization,
        ebittda2: calculatedData.ebit2 + data.depreciationAmortization2,
        preTaxIncome: calculatedData.ebit - data.interestPaid,
        preTaxIncome2: calculatedData.ebit2 - data.interestPaid2
      });

      Object.assign(calculatedData, {
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
      Object.assign(data, calculatedData);

      app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, data);

      setTimeout(() => app.routers.navigateWithReload('/calculator/established-business/finish', {trigger: true}), 10);
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

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);

      this.$el.html(this.template({
        data,
      }));

      this.$('[data-toggle="tooltip"]').tooltip({
        html: true,
        offset: '4px 2px',
        template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });

      return this;
    }
  }, app.helpers.calculatorValidation.methods)),

  finish: Backbone.View.extend({
    el: '#content',

    template: require('./templates/finish.pug'),

    goToStep3() {
      app.routers.navigate('/calculator/established-business/step-3', {trigger: true});
    },

    render: function () {
      // disable enter to the final step of the establishedBusiness calculator without data
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data || !data.graphData) {
        setTimeout(this.goToStep3, 100);
        return this;
      }

      const { graphData, raiseCash } = data;
      const estimate = graphData[0].data[0][1];

      this.$el.html(this.template({
        estimate: app.helpers.format.formatMoney(estimate),
        raise: app.helpers.format.formatMoney(raiseCash),
        offer: (raiseCash * 100 / (estimate + raiseCash)).toFixed(2)
      }));

      this.buildGraph(graphData);

      $('body').scrollTop(0);

      if (app.user.data.info.length === 0) {
        setTimeout(() => {
          api.makeRequest(
              app.config.emailServer + '/subscribe',
              'PUT',
              {'type': 'calc'}
              );
        }, 1000);
      }

      return this;
    },

    buildGraph(data) {
      require.ensure([
        'src/js/graph/graph.js',
        'src/js/graph/jquery.flot.categories.js',
        'src/js/graph/jquery.flot.growraf',
      ], () => {
        require('src/js/graph/graph.js');
        require('src/js/graph/jquery.flot.categories.js');
        require('src/js/graph/jquery.flot.growraf');

        this.$plot = $.plot($("#chart"), data, {
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
              return app.helpers.format.formatPrice(val).replace(/\,/g, ' ');
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

        app.helpers.calculator.bindResizeTo(this.$plot);

      }, 'graph_chunk');
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      if (this.$plot) {
        app.helpers.calculator.unbindResizeFrom(this.$plot);
        this.$plot.shutdown();
        this.$plot = null;
      }
    },
  })
};
