module.exports = {
  routes: {
    'calculator/established-business/intro': 'calculatorEstablishedBusinessIntro',
    'calculator/established-business/step-1': 'calculatorEstablishedBusinessStep1',
    'calculator/established-business/step-2': 'calculatorEstablishedBusinessStep2',
    'calculator/established-business/step-3': 'calculatorEstablishedBusinessStep3',
    'calculator/established-business/finish': 'calculatorEstablishedBusinessFinish',
  },
  historicalRoutes: {
    'calculator/establishedbusiness/intro': 'calculator/established-business/intro',
    'calculator/establishedbusiness/step-1': 'calculator/established-business/step-1',
    'calculator/establishedbusiness/step-2': 'calculator/established-business/step-2',
    'calculator/establishedbusiness/step-3': 'calculator/established-business/step-3',
    'calculator/establishedbusiness/finish': 'calculator/established-business/finish',
  },
  methods: {
    calculatorEstablishedBusinessIntro() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.intro();
        app.currentView.render();
        app.hideLoading();
        $('body').scrollTo();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep1() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step1();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep2() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step2();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep3() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step3();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessFinish() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.finish();
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },
  },
  auth: ['calculatorEstablishedBusinessFinish'],
};
