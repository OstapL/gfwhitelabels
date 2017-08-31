module.exports = {
  routes: {
    'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
    'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
    'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3',
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
