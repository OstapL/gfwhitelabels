module.exports = {
  routes: {
    'calculator/establishedBusiness/intro': 'calculatorEstablishedBusinessIntro',
    'calculator/establishedBusiness/step-1': 'calculatorEstablishedBusinessStep1',
    'calculator/establishedBusiness/step-2': 'calculatorEstablishedBusinessStep2',
    'calculator/establishedBusiness/step-3': 'calculatorEstablishedBusinessStep3',
    'calculator/establishedBusiness/finish': 'calculatorEstablishedBusinessFinish',
  },
  methods: {
    calculatorEstablishedBusinessIntro() {
      require.ensure([], () => {
        const View = require('./views');
        new View.intro().render();
        app.hideLoading();
        $('body').scrollTo();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep1() {
      require.ensure([], () => {
        const View = require('./views');
        new View.step1().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep2() {
      require.ensure([], () => {
        const View = require('./views');
        new View.step2().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessStep3() {
      require.ensure([], () => {
        const View = require('./views');
        new View.step3().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },

    calculatorEstablishedBusinessFinish() {
      require.ensure([], () => {
        const View = require('./views');
        new View.finish().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'establish_business_calculator_chunk');
    },
  },
  auth: ['calculatorEstablishedBusinessFinish'],
};
