module.exports = Backbone.Router.extend({
  routes: {
    'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
    'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
    'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish'
  },

  calculatorCapitalraiseIntro() {
    require.ensure([], () => {
      const View = require('./views');

      new View.intro().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorCapitalraiseStep1() {
    require.ensure([], () => {
      const View = require('./views');

      new View.step1().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  },

  calculatorCapitalraiseFinish() {
    require.ensure([], () => {
      const View = require('./views');

      new View.finish().render();

      $('#content').scrollTo();
      app.hideLoading();
    });
  }
});
