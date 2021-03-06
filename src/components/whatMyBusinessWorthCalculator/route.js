module.exports = {
  routes: {
    'calculator/selectyourbusiness': 'selectYourBusiness',
    'calculator/businessvaluation': 'businessValuation',
    'calculator/whatmybusinessworth/intro': 'calculatorWhatMyBusinessWorthIntro',
    'calculator/whatmybusinessworth/step-1': 'calculatorWhatMyBusinessWorthStep1',
    'calculator/whatmybusinessworth/step-2': 'calculatorWhatMyBusinessWorthStep2',
    'calculator/whatmybusinessworth/finish': 'calculatorWhatMyBusinessWorthFinish',
  },
  methods: {
    selectYourBusiness() {
      //left just for backward compatibility
      app.routers.navigate('/calculator/businessvaluation', { trigger: true });
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
