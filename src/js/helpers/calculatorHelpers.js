module.exports = {
    formatPrice(price = '') {
        if (!price) return '';
        price = price + '';
        return "$" + price.split('').reverse().map(function(item, index) {
                return (index + 1) % 3 == 0 && (index + 1) != price.length ? ',' + item : item
            }).reverse().join('');
    },

    getCaretPosition(oField) {
        // Initialize
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {

            // Set focus on the element
            oField.focus();

            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange();

            // Move selection start to 0 position
            oSel.moveStart('character', -oField.value.length);

            // The caret position is selection length
            iCaretPos = oSel.text.length;
        }

        // Firefox support
        else if (oField.selectionStart || oField.selectionStart == '0')
            iCaretPos = oField.selectionStart;

        // Return results
        return iCaretPos;
    },

    isTextSelected(input) {
        if (typeof input.selectionStart == "number") {
            return {
                selected: input.selectionStart != input.selectionEnd,
                fullSelected: input.selectionStart == 0 && input.selectionEnd == input.value.length,
                start: input.selectionStart,
                end: input.selectionEnd
            };
        } else if (typeof document.selection != "undefined") {
            input.focus();
            let selection = document.selection.createRange();
            return {
                selected: !!selection.text,
                fullSelected: selection.text == input.value,
                start: input.value.indexOf(),
                end: input.value.lastIndexOf(selection.text)
            };
        }
    },

    setCaretPosition(input, selectionStart, selectionEnd = selectionStart) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    },

    settings: {
        TABKEYCODE: 9,
        BACKSPACEKEYCODE: 8,
        HOMEKEYCODE: 35,
        ENDKEYCODE: 36,
        LEFTARROWKEYCODE: 37,
        RIGHTARROWKEYCODE: 39,
        F5KEYCODE: 116,
        CKEYCODE: 67,
        VKEYCODE: 86
    }
};
