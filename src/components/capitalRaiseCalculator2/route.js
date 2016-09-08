module.exports = Backbone.Router.extend({
    routes: {
        // 'calculator/capitalraise2/intro': 'calculatorCapitalraise2Intro',
        'calculator/capitalraise2/step-1': 'calculatorCapitalraise2Step1',
        'calculator/capitalraise2/finish': 'calculatorCapitalraise2Finish'
    },

    // calculatorCapitalraiseIntro() {
    //     require.ensure([], () => {
    //         let Model = require('./model');
    //         let View = require('./views');
    //
    //         new View.intro({
    //             model: app.getModelInstance(Model, 'calculatorCapitalraise2').setFormattedPrice()
    //         }).render();
    //
    //         app.hideLoading();
    //     });
    // },

    calculatorCapitalraise2Step1() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.step1({
                model: app.getModelInstance(Model, 'calculatorCapitalraise2').setFormattedPrice()
            }).render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorCapitalraise2Finish() {
        require.ensure([], () => {
            let Model = require('./model');
            let View = require('./views');

            new View.finish({
                model: app.getModelInstance(Model, 'calculatorCapitalraise2').setFormattedPrice()
            }).render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    }
});
