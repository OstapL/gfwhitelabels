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

            $('#content').scrollTo();
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

            $('#content').scrollTo();
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

            $('#content').scrollTo();
            app.hideLoading();
        });
    }
});
