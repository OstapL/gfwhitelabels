require('sass/pages/_calculator.sass');
var getCaretPosition = require("../../../helpers/getCaretPosition");
var setCaretPosition = require("../../../helpers/setCaretPosition");
var formatPrice = require("../../../helpers/formatPrice");
var settings = require("../../../helpers/settings")();
var isTextSelected = require("../../../helpers/isTextSelected");

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/capitalraise/step1.pug'),

    initialize() {
        // timeout for saving calculator data into the model
        this.saveTimeout = null;

        // data which contains calculated income
        this.outputData = [];

        // flag for skipping formatted price
        this.skipActions = false;

        // cursor position into input
        this.cursorPosition = null;

        // change action; can be "add" or "delete"
        this.changeAction = null;

        // state of the selected text
        this.selectedText = null;
    },

    events: {
        // calculate your income
        'submit .js-calc-form': 'doCalculation',

        // save values into the model
        'keydown [data-input-mask="price"]': 'saveValues',
        //'keyup [data-input-mask="price"]': 'setFormattedValue',

        // remove useless zeros: 0055 => 55
        'blur .js-field': 'cutZeros'
    },

    ui() {
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        // declare ui elements for the view
        this.ui();

        return this;
    }
});