// import './styles/style.sass'
import calculatorHelper from '../../helpers/calculatorHelpers';
import flyPriceFormatter from '../../helpers/flyPriceFormatter';
import lookupData from '../../helpers/capitalraiseCalculatorData';

let formatPrice = calculatorHelper.formatPrice;
let industryData = lookupData();

module.exports = {
    intro: Backbone.View.extend({
        el: '#content',

        template: require('./templates/intro.pug'),

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    step1: Backbone.View.extend({
        el: '#content',

        template: require('./templates/step1.pug'),

        initialize() {
            // declare data for two selects
            this.industryEstablishment = [
                {
                    text: 'New and potentially growing quickly',
                    value: 1
                },
                {
                    text: 'Fairly well established',
                    value: 2
                }
            ];
            this.typeOfEstablishment = [
                {
                    text: 'Be an improvement to what is currently on the market',
                    value: 3
                },
                {
                    text: 'Be revolutionary and disruptive to the market',
                    value: 4
                }
            ];

            // helper for template
            this.selects = {
                industryEstablishment: this.industryEstablishment,
                typeOfEstablishment: this.typeOfEstablishment
            }
        },

        events: {
            // calculate your income
            'submit .js-calc-form': 'doCalculation',

            // remove useless zeros: 0055 => 55
            'blur .js-field': 'cutZeros',

            'change .js-select': 'saveValueIntoTheModel'
        },

        saveValueIntoTheModel(e) {
            let selectBox = e.target;
            this.model.saveField(selectBox.dataset.modelValue, selectBox.value);
        },

        doCalculation(e) {
            e.preventDefault();

            this.model.calculate();

            app.routers.navigate('/calculator/capitalraise/finish', {trigger: true});
        },

        cutZeros(e) {
            let elem = e.target;
            elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
            elem.value = formatPrice(elem.dataset.currentValue);
        },

        ui() {
            // get inputs by inputmask category
            this.inputPrice = this.$('[data-input-mask="price"]');
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model.toJSON(),
                industryData: Object.keys(industryData),
                selects: this.selects
            }));

            // declare ui elements for the view
            this.ui();

            flyPriceFormatter(this.inputPrice, ({ modelValue, currentValue }) => {
                // save value into the model
                this.model.saveField(modelValue, +currentValue);
            });

            return this;
        }
    }),

    finish: Backbone.View.extend({
        el: '#content',

        template: require('./templates/finish.pug'),

        render: function () {
            this.$el.html(this.template({
                model: this.model.toJSON(),
                formatPrice
            }));

            $('body').scrollTop(0);

            return this;
        }
    })
}