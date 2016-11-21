module.exports = {
  restoreLineBreak(text) {
    return text.replace(/\r\n/g, '<br>');
  },

  shortenFileName(text, toLength=20) {
    const lastLength = 8;

    if (text.length <= toLength) {
      return text;
    }

    let lastPart = text.substring(text.length - lastLength);
    let firstPart = text.substring(0, toLength - lastLength - 3);

    return `${firstPart}...${lastPart}`;

  }
};
