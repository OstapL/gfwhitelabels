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
      const View = require('./views');
      new View.intro().render();
      app.hideLoading();
      $('body').scrollTo();
    },

    calculatorEstablishedBusinessStep1() {
      const View = require('./views');
      new View.step1().render();
      $('body').scrollTo();
      app.hideLoading();
    },

    calculatorEstablishedBusinessStep2() {
      const View = require('./views');
      new View.step2().render();
      $('body').scrollTo();
      app.hideLoading();
    },

    calculatorEstablishedBusinessStep3() {
      const View = require('./views');
      new View.step3().render();
      $('body').scrollTo();
      app.hideLoading();
    },

    calculatorEstablishedBusinessFinish() {
      const View = require('./views');
      new View.finish().render();
      $('body').scrollTo();
      app.hideLoading();
    },
  },
};
