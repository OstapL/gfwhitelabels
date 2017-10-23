import './styles/style.sass'
import 'bootstrap-slider/dist/bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'

const CALCULATOR_NAME = 'WhatMyBusinessWorthCalculator';

const defaultCalculatorData = {
  excessCash: 0,
  ownCache: 0,
  projectedRevenueYear: 0,
  projectedRevenueTwoYears: 0,
  grossMargin: 0,
  monthlyOperatingYear: 0,
  monthlyOperatingTwoYears: 0,
  workingCapital: 0,
  additionalOperating: 0,
  capitalExpenditures: 0,
  taxRate: 0,
  annualInterest: 0,
};

// if (!app.cache.whatMyBusinessWorthCalculator) {
//   app.cache.whatMyBusinessWorthCalculator = {
//     excessCash: 0,
//     ownCache: 0,
//     projectedRevenueYear: 0,
//     projectedRevenueTwoYears: 0,
//     grossMargin: 0,
//     monthlyOperatingYear: 0,
//     monthlyOperatingTwoYears: 0,
//     workingCapital: 0,
//     additionalOperating: 0,
//     capitalExpenditures: 0,
//     taxRate: 0,
//     annualInterest: 0,
//   }
// }

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
    events: Object.assign({
      'submit form': 'nextStep',
      'blur [type=money]': saveValue,
    }, app.helpers.calculatorValidation.events),

    initialize() {
      this.fields = {
        excessCash: {
          required: true,
          type: 'money',
          validate: {},
        },
        ownCache: {
          required: true,
          type: 'money',
          validate: {},
        },
        projectedRevenueYear: {
          required: true,
          type: 'money',
          validate: {},
        },
        projectedRevenueTwoYears: {
          required: true,
          type: 'money',
          validate: {},
        },
        grossMargin: {
          required: true,
          type: 'percent',
          validate: {},
          label: 'Gross Margin',
          range: [1, 100],
        },
        monthlyOperatingYear: {
          required: true,
          type: 'money',
          validate: {},
        },
      };
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      this.$('[data-toggle="tooltip"]').tooltip('dispose');
      this.bootstrapSlider.each(function() {
        $(this).bootstrapSlider('destroy')
      });
    },

    nextStep(e) {
      e.preventDefault();

      if (this.validate(e)) {
        app.routers.navigate('/calculator/capital-raise/step-2', {trigger: true});
      } 
    },

    render: function () {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME, defaultCalculatorData);
      this.$el.html(this.template({
        data,
      }));

      // bootstrap slider
      this.bootstrapSlider = this.$('.js-bootstrap-slider');
      this.bootstrapSlider.each(function () {
        $(this).bootstrapSlider({
          min: 0,
          max: 100,
          formatter(value) {
            return app.helpers.format.formatPercent(value) || '0%';
          }
        }).on('slideStop', saveValue);
      });

      this.$('[data-toggle="tooltip"]').tooltip({
        html: true,
        offset: '4px 2px',
        template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });

      return this;
    },

  }, app.helpers.calculatorValidation.methods)),

  step2: Backbone.View.extend(Object.assign({
    el: '#content',
    template: require('./templates/step2.pug'),
    events: Object.assign({
      // calculate your income
      'submit .js-calc-form': 'doCalculation',
      'click .next': (e) => { e.preventDefault(); $('.js-calc-form').submit(); return false; },
      'blur [type=money]': saveValue,
    }, app.helpers.calculatorValidation.events),

    initialize() {
      this.fields = {
        monthlyOperatingTwoYears: {
          required: true,
          type: 'integer',
          validate: {},
        },
        workingCapital: {
          required: true,
          type: 'integer',
          validate: {},
          label: 'Working Capital',
          range: [1, 100],
        },
        additionalOperating: {
          required: true,
          type: 'integer',
          validate: {},
        },
        capitalExpenditures: {
          required: true,
          type: 'integer',
          validate: {},
        },
        taxRate: {
          required: true,
          type: 'integer',
          validate: {},
          label: 'Tax Rate',
          range: [1, 100],
        },
        annualInterest: {
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
      this.bootstrapSlider.each(function() {
        $(this).bootstrapSlider('destroy');
      });
    },

    doCalculation(e) {
      e.preventDefault();

      if (!this.validate(e)) {
        return;
      }

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);

      // "Baseline Capital Needs" calculations
      this.calculateWithDelta(data);

      // "50% over Baseline Capital Needs" calculations
      this.calculateWithDelta(data, 'overBaseline');

      // calculate final amount of raise
      data.finalRaiseAmount = Math.round(Math.max(data.raiseAmount, data.raiseAmount2));

      app.helpers.calculator.saveCalculatorData(CALCULATOR_NAME, data);

      app.routers.navigate('/calculator/capital-raise/finish', {trigger: true});
    },

    calculateWithDelta(data, type = 'default') {
      let calculatedData = {},
        // convert values into percents
        grossMargin = data.grossMargin / 100,
        workingCapital = data.workingCapital / 100,
        taxRate = data.taxRate / 100;

      // calculate "Gross Profit" and "Operating Expenses"
      let delta = type == 'overBaseline' ? 1.5 : 1,
        addValue = type == 'overBaseline' ? data.additionalOperating : 0,
        finalKey = type == 'overBaseline' ? 'raiseAmount2' : 'raiseAmount';

      Object.assign(calculatedData, {
        grossProfitYear1: Math.round(grossMargin * data.projectedRevenueYear * delta),
        grossProfitYear2: Math.round(grossMargin * data.projectedRevenueTwoYears * delta),
        operatingExpensesYear1: (data.monthlyOperatingYear + addValue) * 12,
        operatingExpensesYear2: (data.monthlyOperatingTwoYears + addValue) * 12
      });

      // calculate "Operating Profit"
      Object.assign(calculatedData, {
        operatingProfitYear1: calculatedData.grossProfitYear1 - calculatedData.operatingExpensesYear1,
        operatingProfitYear2: calculatedData.grossProfitYear2 - calculatedData.operatingExpensesYear2
      });

      // calculate "Pre-Tax Profit"
      Object.assign(calculatedData, {
        preTaxProfitYear1: calculatedData.operatingProfitYear1 - data.annualInterest,
        preTaxProfitYear2: calculatedData.operatingProfitYear2 - data.annualInterest
      });

      // calculate "Taxes"
      Object.assign(calculatedData, {
        taxesYear1: taxRate * calculatedData.preTaxProfitYear1,
        taxesYear2: taxRate * calculatedData.preTaxProfitYear2
      });

      // calculate "Net Income"
      Object.assign(calculatedData, {
        netIncomeYear1: calculatedData.preTaxProfitYear1 - calculatedData.taxesYear1,
        netIncomeYear2: calculatedData.preTaxProfitYear2 - calculatedData.taxesYear2
      });

      // calculate "Working Capital Needs"
      Object.assign(calculatedData, {
        workingCapitalNeedsYear1: workingCapital * data.projectedRevenueYear * delta,
        workingCapitalNeedsYear2: workingCapital * data.projectedRevenueTwoYears * delta
      });

      // calculate "Total Cash Generated"
      Object.assign(calculatedData, {
        totalCashGeneratedYear1: calculatedData.netIncomeYear1 - calculatedData.workingCapitalNeedsYear1 - data.capitalExpenditures,
        totalCashGeneratedYear2: calculatedData.netIncomeYear2 - calculatedData.workingCapitalNeedsYear2
      });

      // calculate "Additional Cash Needed"
      Object.assign(calculatedData, {
        addCashNeeded1Year1: data.excessCash - data.ownCache - calculatedData.totalCashGeneratedYear1,
        addCashNeeded1Year2: calculatedData.totalCashGeneratedYear2 > 0 ? 0 : -calculatedData.totalCashGeneratedYear2
      });


      // calculate "The Amount You Should Raise"
      calculatedData[finalKey] = calculatedData.addCashNeeded1Year1 + calculatedData.addCashNeeded1Year2;

      // save calculated data
      Object.assign(data, calculatedData);
    },

    isFirstStepFilled() {
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data || app.utils.isEmpty(data))
        return false;

      const props = ['excessCash', 'ownCache', 'projectedRevenueYear', 'projectedRevenueTwoYears', 'grossMargin', 'monthlyOperatingYear'];
      const fieldsWithValue = props.filter(name => !!data[name]);
      return fieldsWithValue && fieldsWithValue.length;
    },

    render() {
      // disable enter to the step 2 of capitalraise calculator without data entered on the first step
      // if (!this.isFirstStepFilled()) {
      //     app.routers.navigate('/calculator/capital-raise', {trigger: true});
      //     return false;
      // }

      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME, defaultCalculatorData);
      this.$el.html(this.template({
        data,
      }));

      // bootstrap slider
      this.bootstrapSlider = this.$('.js-bootstrap-slider');
      this.bootstrapSlider.each(function () {
        $(this).bootstrapSlider({
          min: 0,
          max: 100,
          formatter(value) {
            return app.helpers.format.formatPercent(value) || '0%';
          }
        }).on('slideStop', saveValue);
      });

      this.$('[data-toggle="tooltip"]').tooltip({
        html: true,
        offset: '4px 2px',
        template: '<div class="tooltip tooltip-custom" role="tooltip"><i class="fa fa-info-circle"></i><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });

      $('body').scrollTop(0);

      return this;
    },

  }, app.helpers.calculatorValidation.methods)),

  finish: Backbone.View.extend({
    el: '#content',

    template: require('./templates/finish.pug'),

    render: function () {
      // disable enter to the final step of whatmybusinessworth calculator without data
      const data = app.helpers.calculator.readCalculatorData(CALCULATOR_NAME);
      if (!data || !data.grossMargin) {
        setTimeout(() => app.routers.navigate('/calculator/capital-raise/step-1', { trigger: true }), 100);
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
};
