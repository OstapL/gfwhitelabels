// import './styles/style.sass'

// app.cache.capitalRaiseCalculator = {
//   // 'excessCash': '',
//   'CashOnHand': '',
//   'projectedRevenue': '',
//   'projectedRevenueTwo': '',
//   // 'firstYearExpenses': '',
//   'operatingProfit': '',
//   'operatingProfitTwo': '',
//   'yourDebt': '',
//   'cashRaise': '',
//   'liquidityAdjustment': 0, // 0 %
//
//   // select boxes
//   'industry': '',
//
//   // 'New and potentially growing quickly' - 1
//   // 'Fairly well established' - 2
//   'industryEstablishment': 0,
//
//   // 'Be an improvement to what is currently on the market' - 3
//   // 'Be revolutionary and disruptive to the market' - 4
//   'typeOfEstablishment': 0
// }

const defaultCalculatorData = {
  'liquidityAdjustment': 0,
  // 'New and potentially growing quickly' - 1
  // 'Fairly well established' - 2
  'industryEstablishment': 0,
  // 'Be an improvement to what is currently on the market' - 3
  // 'Be revolutionary and disruptive to the market' - 4
  'typeOfEstablishment': 0,
};

let industryData = app.helpers.capitalraiseData();

const CALCULATOR_NAME = 'CapitalRaiseCalculator';

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
    },
  }),

  step1: Backbone.View.extend(Object.assign({
    el: '#content',
    template: require('./templates/step1.pug'),
    initialize() {
      this.fields = {
        industry: {
          required: true,
          type: 'integer',
          validate: {},
        },
        industryEstablishment: {
          required: true,
          type: 'integer',
          validate: {},
        },
        typeOfEstablishment: {
          required: true,
          type: 'integer',
          validate: {},
        },
        projectedRevenue: {
          required: true,
          type: 'integer',
          validate: {},
        },
        operatingProfit: {
          required: true,
          type: 'integer',
          validate: {},
        },
        projectedRevenueTwo: {
          required: true,
          type: 'integer',
          validate: {},
        },
        operatingProfitTwo: {
          required: true,
          type: 'integer',
          validate: {},
        },
        CashOnHand: {
          required: true,
          type: 'integer',
          validate: {},
        },
        yourDebt: {
          required: true,
          type: 'integer',
          validate: {},
        },
        cashRaise: {
          required: true,
          type: 'integer',
          validate: {},
        },
      };

      // declare data for two selects
      this.industryEstablishment = [
        {
          text: 'New and potentially growing quickly',
          value: 1
        },
        {
          text: 'Fairly well established',
          value: 2
        }
      ];
      this.typeOfEstablishment = [
        {
          text: 'Be an improvement to what is currently on the market',
          value: 3
        },
        {
          text: 'Be revolutionary and disruptive to the market',
          value: 4
        }
      ];

      // helper for template
      this.selects = {
        industryEstablishment: this.industryEstablishment,
        typeOfEstablishment: this.typeOfEstablishment
      };

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data || app.utils.isEmpty(data)) {
        app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, defaultCalculatorData);
      }

      this.listenToNavigate();
    },

    events: Object.assign({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
      'click .next': (e) => { e.preventDefault(); $('.js-calc-form').submit(); return false; },
      'change .js-select': saveValue,
      'blur input[type=money]': saveValue,

    }, app.helpers.calculatorValidation.events),

    doCalculation(e) {
      e.preventDefault();

      if (!this.validate(e)) {
        return;
      }

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME),
        calculatedData = {},
        industry = data.industry,
        row = industryData[industry],
        ntmPs = row[4],
        ntmEv = row[5];

      // calculate NTM and post capital raise
      Object.assign(calculatedData, {
        ntmPs,
        ntmEv,
        postCapitalRaise: data.CashOnHand - data.yourDebt + data.cashRaise
      });
      // calculate P/S and EV/EBIT for year1 and year5
      Object.assign(calculatedData, {
        year1Ps: ntmPs * data.projectedRevenue,
        year1Ev: ntmEv * data.operatingProfit + calculatedData.postCapitalRaise,
        year5Ps: ntmPs * data.projectedRevenueTwo + calculatedData.postCapitalRaise,
        year5Ev: ntmEv * data.operatingProfitTwo + calculatedData.postCapitalRaise
      });

      // calculate Average for year1 and year5
      Object.assign(calculatedData, {
        year1Average: (calculatedData.year1Ps + calculatedData.year1Ev) / 2,
        year5Average: (calculatedData.year5Ps + calculatedData.year5Ev) / 2
      });

      // calculate NPV for year1 and year5
      Object.assign(calculatedData, {
        year1Npv: calculatedData.year1Average,
        year5Npv: calculatedData.year5Average / Math.pow(1.1, 4)
      });

      // calculate average NPV
      calculatedData.averageNPV = (calculatedData.year1Npv + calculatedData.year5Npv) / 2;

      // calculate Liquidity-Adjusted Average NPV
      calculatedData.liquidityAdjustmentAverageNPV = calculatedData.averageNPV / (1 - data.liquidityAdjustment);

      // calculate probability of failure (depends on Industry/Product Permutation)
      const mathHelper = {
        '2:3': 0.3,
        '2:4': 0.5,
        '1:3': 0.5,
        '1:4': 0.7
      };
      let failure = mathHelper[data.industryEstablishment + ':' + data.typeOfEstablishment];
      calculatedData.probabilityOfFailure = failure;

      // calculate GrowthFountain Recommended Pre Money Valuation
      calculatedData.PreMoneyValuation = Math.ceil(calculatedData.liquidityAdjustmentAverageNPV / (1 + calculatedData.probabilityOfFailure))

      // save calculated data
      app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, Object.assign(data, calculatedData));

      setTimeout(() => app.routers.navigateWithReload('/calculator/startup/finish', {trigger: true}), 10);
    },

    render() {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);

      this.$el.html(this.template({
        data,
        industryData: Object.keys(industryData),
        selects: this.selects,
      }));

      return this;
    },

  }, app.helpers.calculatorValidation.methods)),

  finish: Backbone.View.extend({
    el: '#content',
    template: require('./templates/finish.pug'),

    render() {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      let dataSameAsDefault = true;
      Object.keys(data || {}).forEach((key) => {
        if (data[key] === defaultCalculatorData[key]) {
          ;
        } else if (data[key] === '') {
          ;
        } else {
          dataSameAsDefault = false;
        }
      });

      //TODO: add data validation
      if (dataSameAsDefault || !data.PreMoneyValuation) {
        setTimeout(() => app.routers.navigate('/calculator/startup/step-1', {trigger: true}), 100);
        return this;
      }

      this.$el.html(this.template({
        data,
      }));

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
    }
  })
}
