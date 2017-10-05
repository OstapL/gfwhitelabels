module.exports = {
  routes: {
    'calculator/revenue-share': 'calculatorPaybackshareStep1',
    'calculator/revenue-share/step-2': 'calculatorPaybackshareStep2',
    'calculator/revenue-share/step-3': 'calculatorPaybackshareStep3',
  },
  //map historicalRoute: actualRoute
  historicalRoutes: {
    'calculator/paybackshare/step-1': 'calculator/revenue-share',
    'calculator/paybackshare/step-2': 'calculator/revenue-share/step-2',
    'calculator/paybackshare/step-3': 'calculator/revenue-share/step-3',
  },
  methods: {
    calculatorPaybackshareStep1() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step1().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'payback_share_calculator_chunk');
    },

    calculatorPaybackshareStep2() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step2().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'payback_share_calculator_chunk');
    },

    calculatorPaybackshareStep3: function () {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step3().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'payback_share_calculator_chunk');
    },
  },
  auth: ['calculatorPaybackshareStep3'],
};
