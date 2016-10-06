var calculatorHelper = require("./calculatorHelpers");
var getCaretPosition = calculatorHelper.getCaretPosition;
var isTextSelected = calculatorHelper.isTextSelected;
var settings = calculatorHelper.settings;
var formatPrice = calculatorHelper.formatPrice;
var setCaretPosition = calculatorHelper.setCaretPosition;

module.exports = function(field, callback) {
    if (!field) return false;
    return (function($) {
        // flag for skipping formatted price
        let skipActions = null;
        // timeout for saving calculator data into the model
        let saveTimeout = null;
        // change action; can be "add" or "delete"
        let changeAction = 'add';
        // not-formatted value of the input
        let currentValue = null;
        // cursor position into input
        let cursorPosition = null;
        // state of the selected text
        let selectedText = {};

        field.on('keydown', function(e) {
            clearTimeout(saveTimeout);
            let elem = e.target;
            let value = elem.value;
            let keyCode = null;

            // get not formatted value
            currentValue = elem.dataset.currentValue;

            // get caret position into the input field
            cursorPosition = getCaretPosition(e.target);

            // working with selection
            selectedText = isTextSelected(elem);
            if (selectedText.fullSelected) {
                currentValue = "";
                value = "";
            } else if (selectedText.selected) {
                // cut input visual value
                value = cutStr(value, selectedText.start, selectedText.end - 1);

                // set input real value
                currentValue = value.replace('$', '').replace(/,/g, '');
            }

            // setup default action
            changeAction = 'add';

            // set the flag to false, means do price formatting on keypress
            skipActions = false;

            // allow only numbers
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                changeAction = 'add';
            } else if (e.keyCode == settings.BACKSPACEKEYCODE) {
                changeAction = 'delete';
                if (!value && cursorPosition == 0) {
                    skipActions = true;
                }
            } else if (e.keyCode == settings.TABKEYCODE ||
                e.keyCode == settings.LEFTARROWKEYCODE ||
                e.keyCode == settings.RIGHTARROWKEYCODE ||
                e.keyCode == settings.HOMEKEYCODE ||
                e.keyCode == settings.ENDKEYCODE ||
                e.keyCode == settings.F5KEYCODE ||
                e.keyCode == settings.ENTERKEYCODE ||
                ((e.ctrlKey || e.metaKey) && e.keyCode == settings.CKEYCODE) ||
                ((e.ctrlKey || e.metaKey) && e.keyCode == settings.VKEYCODE)
                ) {
                skipActions = true;
            } else {
                skipActions = true;
                return false;
            }

            if (skipActions) {
                return true;
            }

            // save value into data set
            if (changeAction == 'add') {
                keyCode = (e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode;

                // insert character at the middle of the string
                if (cursorPosition < value.length) {
                    let arrHelper = value.split("");
                    arrHelper.splice(cursorPosition, 0, String.fromCharCode(keyCode));
                    currentValue = arrHelper.join("").replace('$', '').replace(/,/g, '');
                } else {
                    // add character to the end of the string
                    currentValue += String.fromCharCode(keyCode);
                }
            } else if (changeAction == 'delete' && cursorPosition != 0) {
                // if we are deleting a selection then
                // don't do anything because we have already cut our value
                if (!selectedText.selected) {
                    // if we are deleting some character at the middle of the string
                    if (cursorPosition < value.length) {
                        let strHelper = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
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
                setFormattedValue(e);
            }, 10);
        }).on('blur', function(e) {
            let elem = e.target,
                value = elem.value.replace('$', '').replace(/,/g, '');

            if (!value) {
                elem.dataset.currentValue = 0;
                elem.value = '';
            } else {
                elem.dataset.currentValue = parseFloat(value);
                elem.value = formatPrice(elem.dataset.currentValue);
            }
        });
        

        function setFormattedValue(e) {
            if (skipActions) {
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
            if (changeAction == "add") {
                setCaretPosition(e.target, cursorPosition + diff + 1);
            } else if (changeAction == "delete") {
                let helperCount = selectedText.selected ? 0 : 1;
                setCaretPosition(e.target, cursorPosition - diff - helperCount);
            }

            callback({ modelValue, currentValue });
        }

        function cutStr(str, cutStart, cutEnd) {
            return str.substr(0, cutStart) + str.substr(cutEnd + 1);
        }
    })(jQuery);
};
