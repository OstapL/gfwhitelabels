module.exports = {
  routes: {
    'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
    'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
    'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish',
  },
  methods: {
    calculatorCapitalraiseIntro() {
      require.ensure([], () => {
        const View = require('./views');
        new View.intro().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },

    calculatorCapitalraiseStep1() {
      require.ensure([], () => {
        const View = require('./views');
        new View.step1().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },

    calculatorCapitalraiseFinish() {
      require.ensure([], () => {
        const View = require('./views');
        new View.finish().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },
  },
  auth: ['calculatorCapitalraiseFinish'],
};
