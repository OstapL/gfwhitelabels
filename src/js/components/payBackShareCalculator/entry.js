export default {
    router: Backbone.Router.extend({
        routes: {
            'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
            'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
            'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3'
        },

        calculatorPaybackshareStep1() {
            require.ensure([], () => {
                let Model = require('./model');
                let View = require('./views');

                new View.step1({
                    model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
                }).render();

                app.hideLoading();
            });
        },

        calculatorPaybackshareStep2() {
            require.ensure([], () => {
                let Model = require('./model');
                let View = require('./views');

                new View.step2({
                    model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
                }).render();

                app.hideLoading();
            });
        },

        calculatorPaybackshareStep3() {
            require.ensure([], () => {
                let Model = require('./model');
                let View = require('./views');

                new View.step3({
                    model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
                }).render();

                app.hideLoading();
            });
        },

        execute(callback, args, name) {
            // disable enter to the final step of paybackshare calculator without data
            if (name == 'calculatorPaybackshareStep3') {
                if (!app.models['calculatorPaybackshare'] || !app.models['calculatorPaybackshare'].get('outputData')) {
                    app.routers.navigate('/calculator/paybackshare/step-2', {trigger: true});
                    return false;
                }
            }

            if (callback) callback.apply(this, args);
        }
    })
}