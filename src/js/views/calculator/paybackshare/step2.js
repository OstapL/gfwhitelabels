require('sass/pages/_calculator.sass');
require("../../../../../node_modules/jquery.inputmask/dist/jquery.inputmask.bundle.js");
var getCaretPosition = require("../../../helpers/getCaretPosition");
var setCaretPosition = require("../../../helpers/setCaretPosition");
var formatPrice = require("../../../helpers/formatPrice");
var settings = require("../../../helpers/settings")();
var isTextSelected = require("../../../helpers/isTextSelected");

module.exports = Backbone.View.extend({
    el: '#content',

    template: require('templates/calculator/paybackshare/step2.pug'),

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

    doCalculation(e) {
        e.preventDefault();
        let maxOfMultipleReturned = 0,
            countOfMultipleReturned = 0;
        // calculate income for 10 years
        // set the first year
        this.outputData[0] = {};
        this.outputData[0].fundraise = this.model.get('raiseMoney');

        // set the second year
        this.outputData[1] = {};
        this.outputData[1].revenue = this.model.get('nextYearRevenue');

        // set all other year
        for (var i = 2; i < 11; i++) {
            this.outputData[i] = {};

            this.outputData[i].revenue = Math.ceil(this.outputData[i - 1].revenue * (1 + this.model.get('growLevel') / 100));
            this.outputData[i].annual = Math.ceil(0.05 * this.outputData[i].revenue);

            let helper = {
                sum: this.getPreviousSum(i),
                divided: this.getPreviousSum(i) / this.model.get('raiseMoney')
            };
            this.outputData[i].multiple = Math.min(parseFloat(helper.divided.toFixed(1)), 2);

            // change max value of multiple returned
            if (this.outputData[i].multiple > maxOfMultipleReturned) {
                maxOfMultipleReturned = this.outputData[i].multiple;
            }

            // skip adding maximum "multiple returned" value more then one time
            if (this.outputData[i].multiple >= 2) {
                countOfMultipleReturned++;
                if (countOfMultipleReturned > 1) {
                    this.outputData[i].multiple = "";
                }
            }

            this.outputData[i].total = Math.min(parseFloat(helper.sum.toFixed(1)), 2 * this.model.get('raiseMoney'));
        }

        // save data into the model
        this.model.saveOutputData({ outputData: this.outputData, maxOfMultipleReturned });

        // navigate to the finish step
        app.routers.navigate('/calculator/paybackshare/step-3', {trigger: true});
    },

    saveValues(e) {
        clearTimeout(this.saveTimeout);

        let elem = e.target,
            value = elem.value,
            keyCode = null,

        // get not formatted value
        currentValue = elem.dataset.currentValue;

        // get caret position into the input field
        this.cursorPosition = getCaretPosition(e.target);

        // working with selection
        this.selectedText = isTextSelected(elem);
        if (this.selectedText.fullSelected) {
            currentValue = "";
            value = "";
        } else if (this.selectedText.selected) {
            // cut input visual value
            value = this.cutStr(value, this.selectedText.start, this.selectedText.end - 1);

            // set input real value
            currentValue = value.replace('$', '').replace(/,/g, '');
        }

        // setup default action
        this.changeAction = 'add';

        // set the flag to false, means do price formatting on keypress
        this.skipActions = false;

        // allow only numbers
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
            this.changeAction = 'add';
        } else if (e.keyCode == settings.BACKSPACEKEYCODE) {
            this.changeAction = 'delete';
            if (!value && this.cursorPosition == 0) {
                this.skipActions = true;
            }
        } else if (e.keyCode == settings.TABKEYCODE ||
            e.keyCode == settings.LEFTARROWKEYCODE ||
            e.keyCode == settings.RIGHTARROWKEYCODE ||
            e.keyCode == settings.HOMEKEYCODE ||
            e.keyCode == settings.ENDKEYCODE ||
            e.keyCode == settings.F5KEYCODE ||
            (e.ctrlKey && e.keyCode == settings.CKEYCODE)) {
            this.skipActions = true;
        } else {
            this.skipActions = true;
            return false;
        }

        if (this.skipActions) {
            return true;
        }

        // save value into data set
        if (this.changeAction == 'add') {
            keyCode = (e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode;

            // insert character at the middle of the string
            if (this.cursorPosition < value.length) {
                let arrHelper = value.split("");
                arrHelper.splice(this.cursorPosition, 0, String.fromCharCode(keyCode));
                currentValue = arrHelper.join("").replace('$', '').replace(/,/g, '');
            } else {
                // add character to the end of the string
                currentValue += String.fromCharCode(keyCode);
            }
        } else if (this.changeAction == 'delete' && this.cursorPosition != 0) {
            // if we are deleting a selection then
            // don't do anything because we have already cut our value
            if (!this.selectedText.selected) {
                // if we are deleting some character at the middle of the string
                if (this.cursorPosition < value.length) {
                    let strHelper = value.slice(0, this.cursorPosition - 1) + value.slice(this.cursorPosition);
                    currentValue = strHelper.replace('$', '').replace(/,/g, '');
                } else {
                    // -//-//- at the end of the string
                    currentValue = currentValue.slice(0, -1);
                }
            }
        }

        // save not-formatted value
        elem.dataset.currentValue = currentValue.slice(0, 21);
        setTimeout(() => {
            this.setFormattedValue(e);
        }, 10);
    },

    cutStr(str, cutStart, cutEnd) {
        return str.substr(0, cutStart) + str.substr(cutEnd + 1);
    },

    setFormattedValue(e) {
        if (this.skipActions) {
            return true;
        }

        let elem = e.target,
            currentValue = elem.dataset.currentValue,
            modelValue = elem.dataset.modelValue;

        // set formatted value to the input
        let formattedPrice = formatPrice(currentValue),
            diff = Math.abs(elem.value.length - formattedPrice.length);
        elem.value = formattedPrice;


        // set caret position to specific one
        if (this.changeAction == "add") {
            setCaretPosition(e.target, this.cursorPosition + diff + 1);
        } else if (this.changeAction == "delete") {
            let helperCount = this.selectedText.selected ? 0 : 1;
            setCaretPosition(e.target, this.cursorPosition - diff - helperCount);
        }

        // save value into the model
        this.model.saveField(modelValue, currentValue);
    },

    cutZeros(e) {
        let elem = e.target;
        elem.dataset.currentValue = parseFloat(elem.value.replace('$', '').replace(/,/g, '') || 0);
        elem.value = formatPrice(elem.dataset.currentValue);
    },

    // get sum of last Annual Distributions
    getPreviousSum(index) {
        let selectedRange = this.outputData.slice(2, index + 1),
            sum = 0;
        for (let row of selectedRange) {
            sum += row.annual;
        }
        return sum;
    },

    ui() {
        // get inputs by inputmask category
        // this.inputPrice = this.$('[data-input-mask="price"]');
        this.inputPercent = this.$('[data-input-mask="percent"]');
    },

    render() {
        this.$el.html(this.template(this.model.toJSON()));

        // declare ui elements for the view
        this.ui();

        // this.inputPrice.inputmask("$9{1,10}", {
        //     placeholder: "0"
        // });

        this.inputPercent.inputmask("9{1,4}%", {
            placeholder: "0"
        });
        return this;
    }
});