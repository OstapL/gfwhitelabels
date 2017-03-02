//TODO: move this to main router
// execute: function (callback, args, name) {
//       if ((name=='calculatorPaybackshareStep1')
// && !app.user.ensureLoggedIn(window.location.pathname)) {
//     return false;
//       };
//       if (callback) callback.apply(this, args)
//   },

module.exports = {
  routes: {
    'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
    'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
    'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3',
  },
  methods: {
    calculatorPaybackshareStep1() {
      const View = require('./views');
      new View.step1().render();
      $('#content').scrollTo();
      app.hideLoading();
    },

    calculatorPaybackshareStep2() {
      const View = require('./views');
      new View.step2().render();
      $('#content').scrollTo();
      app.hideLoading();
    },

    calculatorPaybackshareStep3: function () {
      const View = require('./views');
      new View.step3().render();
      $('#content').scrollTo();
      app.hideLoading();
    },
  },
};
