module.exports = Backbone.Router.extend({
  routes: {
    'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
    'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
    'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3'
  },

  calculatorPaybackshareStep1: function() {
    require.ensure([], () => {
      const Model = require('./model');
      const View = require('./views');

      new View.step1({
        model: new Model()
      }).render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorPaybackshareStep2: function() {
    require.ensure([], () => {
      const Model = require('./model');
      const View = require('./views');

      new View.step2({
        model: new Model()
      }).render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorPaybackshareStep3: function() {
    require.ensure([], () => {
      const Model = require('./model');
      const View = require('./views');

      new View.step3({
        model: new Model()
      }).render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  }
});
