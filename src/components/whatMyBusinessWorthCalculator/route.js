module.exports = {
  routes: {
    'calculator/selectYourBusiness': 'selectYourBusiness',
    'calculator/selectCalculator': 'selectCalculator',
    'calculator/selectCalculator2': 'selectCalculator2',
    'calculator/whatmybusinessworth/intro': 'calculatorWhatMyBusinessWorthIntro',
    'calculator/whatmybusinessworth/step-1': 'calculatorWhatMyBusinessWorthStep1',
    'calculator/whatmybusinessworth/step-2': 'calculatorWhatMyBusinessWorthStep2',
    'calculator/whatmybusinessworth/finish': 'calculatorWhatMyBusinessWorthFinish',
  },
  methods: {
    selectYourBusiness() {
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
      app.hideLoading();
    },

    selectCalculator() {
      let View = Backbone.View.extend({
        el: '#content',
        initialize() {
          this.render();
        },
        template: require('./templates/selectCalculator.pug'),
        render() {
          this.$el.html(this.template());
          return this;
        },
      });

      new View();
      app.hideLoading();
    },

    selectCalculator2() {
      let View = Backbone.View.extend({
        el: '#content',
        initialize() {
          this.render();
        },
        template: require('./templates/selectCalculator2.pug'),
        render() {
          this.$el.html(this.template());
          return this;
        },
      });

      new View();
      app.hideLoading();
    },

    calculatorWhatMyBusinessWorthIntro() {
      let View = require('./views');
      new View.intro().render();
      $('#content').scrollTo();
      app.hideLoading();
    },

    calculatorWhatMyBusinessWorthStep1() {
      const View = require('./views');
      new View.step1().render();
      $('#content').scrollTo();
      app.hideLoading();
    },

    calculatorWhatMyBusinessWorthStep2() {
      const View = require('./views');
      new View.step2().render();
      $('#content').scrollTo();
      app.hideLoading();
    },

    calculatorWhatMyBusinessWorthFinish() {
      const View = require('./views');
      new View.finish().render();
      $('#content').scrollTo();
      app.hideLoading();
    },
  },
  auth: ['calculatorWhatMyBusinessWorthIntro', 'selectYourBusiness'],
};
