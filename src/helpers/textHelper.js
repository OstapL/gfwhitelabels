module.exports = {
  restoreLineBreak(text) {
    return text.replace(/\r\n/g, '<br>');
  },
};