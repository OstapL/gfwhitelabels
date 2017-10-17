module.exports = {
  routes: {
    'calculator/selectyourbusiness': 'selectYourBusiness',
    'calculator/business-valuation': 'businessValuation',

    'calculator/capital-raise': 'calculatorWhatMyBusinessWorthIntro',
    'calculator/capital-raise/step-1': 'calculatorWhatMyBusinessWorthStep1',
    'calculator/capital-raise/step-2': 'calculatorWhatMyBusinessWorthStep2',
    'calculator/capital-raise/finish': 'calculatorWhatMyBusinessWorthFinish',
  },
  historicalRoutes: {
    'calculator/businessvaluation': 'calculator/business-valuation',
    'calculator/whatmybusinessworth/intro': 'calculator/capital-raise',
    'calculator/whatmybusinessworth/step-1': 'calculator/capital-raise/step-1',
    'calculator/whatmybusinessworth/step-2': 'calculator/capital-raise/step-2',
    'calculator/whatmybusinessworth/finish': 'calculator/capital-raise/finish',
  },
  methods: {
    selectYourBusiness() {
      //left just for backward compatibility
      app.routers.navigate('/calculator/business-valuation', { trigger: true });
    },

    businessValuation() {
      require.ensure([], () => {
        let View = Backbone.View.extend({
          el: '#content',
          initialize() {
            this.render();
          },
          template: require('./templates/selectYourBusiness.pug'),
          render() {
            this.$el.html(this.template());
            return this;
          },
        });

        new View();
        $('body').scrollTo();
        app.hideLoading();
      }, 'what_my_business_worth_chunk');
    },

    calculatorWhatMyBusinessWorthIntro() {
      require.ensure([], () => {
        let View = require('./views');
        app.currentView = new View.intro().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'what_my_business_worth_chunk');
    },

    calculatorWhatMyBusinessWorthStep1() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step1().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'what_my_business_worth_chunk');
    },

    calculatorWhatMyBusinessWorthStep2() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.step2().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'what_my_business_worth_chunk');
    },

    calculatorWhatMyBusinessWorthFinish() {
      require.ensure([], () => {
        const View = require('./views');
        app.currentView = new View.finish().render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'what_my_business_worth_chunk');
    },
  },
  auth: ['calculatorWhatMyBusinessWorthFinish'],
};
