module.exports = Backbone.Router.extend({
    routes: {
        'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
        'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
        'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3'
    },

    calculatorPaybackshareStep1: function() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.step1({
                model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
            }).render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorPaybackshareStep2: function() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.step2({
                model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
            }).render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorPaybackshareStep3: function() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.step3({
                model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
            }).render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    }
});
