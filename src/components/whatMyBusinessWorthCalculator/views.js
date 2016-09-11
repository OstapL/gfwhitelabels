import './styles/style.sass'
import 'jquery.inputmask/dist/jquery.inputmask.bundle.js';
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';

let formatPrice = calculatorHelper.formatPrice;

module.exports = {
    // intro: Backbone.View.extend({
    //     el: '#content',
    //
    //     template: require('./templates/intro.pug'),
    //
    //     render: function () {
    //         this.$el.html(this.template(this.model.toJSON()));
    //         return this;
    //     }
    // }),

    step1: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step1.pug'),

        initialize() {

        },

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation',

            // remove useless zeros: 0055 => 55
            'blur .js-field': 'cutZeros'
        },

        doCalculation(e) {
            e.preventDefault();

            this.model.calculate();

            app.routers.navigate('/calculator/whatmybusinessworth/finish', {trigger: true});
        },

        cutZeros(e) {
            let elem = e.target;
            elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
            elem.value = formatPrice(elem.dataset.currentValue);
        },

        ui() {
            // get inputs by inputmask category
            this.inputPrice = this.$('[data-input-mask="price"]');
            this.inputPercent = this.$('[data-input-mask="percent"]');
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value into the model
                this.model.saveField(modelValue, +currentValue);
            });

            this.inputPercent.inputmask("9{1,4}%", {
                placeholder: "0"
            });
            return this;
        }
    }),

    finish: Backbone.View.extend({
        el: '#content',

        template: require('./templates/finish.pug'),

        render: function () {
            // disable enter to the final step of capitalraise calculator without data
            if (!app.cache.hasOwnProperty('whatmybusiness')) {
                app.routers.navigate('/calculator/whatmybusinessworth/step-1', {trigger: true});
                return false;
            }

            this.$el.html(this.template({
                model: app.cache.whatmybusiness,
                formatPrice
            }));

            $('body').scrollTop(0);

            return this;
        }
    })
};
