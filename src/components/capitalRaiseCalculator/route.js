module.exports = Backbone.Router.extend({
  routes: {
    'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
    'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
    'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish'
  },

  calculatorCapitalraiseIntro() {
    require.ensure([], () => {
      const Model = require('./model');
      const View = require('./views');

      new View.intro({
        model: new Model()
      }).render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorCapitalraiseStep1() {
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

  calculatorCapitalraiseFinish() {
    require.ensure([], () => {
      const Model = require('./model');
      const View = require('./views');

      new View.finish({
        model: new Model()
      }).render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  }
});
