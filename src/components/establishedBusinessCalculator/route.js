module.exports = Backbone.Router.extend({
    routes: {
        'calculator/establishedBusiness/intro': 'calculatorEstablishedBusinessIntro',
        'calculator/establishedBusiness/step-1': 'calculatorEstablishedBusinessStep1',
        'calculator/establishedBusiness/step-2': 'calculatorEstablishedBusinessStep2',
        'calculator/establishedBusiness/step-3': 'calculatorEstablishedBusinessStep3',
        'calculator/establishedBusiness/finish': 'calculatorEstablishedBusinessFinish'
    },

    calculatorEstablishedBusinessIntro() {
        require.ensure([], () => {
            const View = require('./views');

            new View.intro().render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorEstablishedBusinessStep1() {
        require.ensure([], () => {
            const View = require('./views');

            new View.step1().render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorEstablishedBusinessStep2() {
        require.ensure([], () => {
            const View = require('./views');

            new View.step2().render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorEstablishedBusinessStep3() {
        require.ensure([], () => {
            const View = require('./views');

            new View.step3().render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    },

    calculatorEstablishedBusinessFinish() {
        require.ensure([], () => {
            const View = require('./views');

            new View.finish().render();

            $('#content').scrollTo();
            app.hideLoading();
        });
    }
});
