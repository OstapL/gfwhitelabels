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
        app.currentView = new View.intro();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },

    calculatorCapitalraiseStep1() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step1();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },

    calculatorCapitalraiseFinish() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.finish();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'raise_capital_calculator_chunk');
    },
  },
  auth: ['calculatorCapitalraiseFinish'],
};
