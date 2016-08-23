module.exports = function(input) {
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
};