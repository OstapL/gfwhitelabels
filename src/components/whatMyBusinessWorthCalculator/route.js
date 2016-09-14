module.exports = Backbone.Router.extend({
  routes: {
    'calculator/whatmybusinessworth/intro': 'calculatorWhatMyBusinessWorthIntro',
    'calculator/whatmybusinessworth/step-1': 'calculatorWhatMyBusinessWorthStep1',
    'calculator/whatmybusinessworth/step-2': 'calculatorWhatMyBusinessWorthStep2',
    'calculator/whatmybusinessworth/finish': 'calculatorWhatMyBusinessWorthFinish'
  },

  calculatorWhatMyBusinessWorthIntro() {
    require.ensure([], () => {
      let View = require('./views');

      new View.intro().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorWhatMyBusinessWorthStep1() {
    require.ensure([], () => {
      const View = require('./views');

      new View.step1().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorWhatMyBusinessWorthStep2() {
    require.ensure([], () => {
      const View = require('./views');

      new View.step2().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorWhatMyBusinessWorthFinish() {
    require.ensure([], () => {
      const View = require('./views');

      new View.finish().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  }
});
