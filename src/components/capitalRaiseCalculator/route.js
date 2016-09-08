module.exports = Backbone.Router.extend({
    routes: {
        'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
        'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
        'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish'
    },

    calculatorCapitalraiseIntro() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.intro({
                model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
            }).render();

            app.hideLoading();
        });
    },

    calculatorCapitalraiseStep1() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.step1({
                model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
            }).render();

            app.hideLoading();
        });
    },

    calculatorCapitalraiseFinish() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.finish({
                model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
            }).render();

            app.hideLoading();
        });
    },

    execute(callback, args, name) {
        // disable enter to the final step of capitalraise calculator without data
        if (name == 'calculatorCapitalraiseFinish') {
            if (!app.models['calculatorCapitalraise'] || !app.models['calculatorCapitalraise'].get('dataIsFilled')) {
                app.routers.navigate('/calculator/capitalraise/step-1', {trigger: true});
                return false;
            }
        }

        if (callback) callback.apply(this, args);
    }
});
