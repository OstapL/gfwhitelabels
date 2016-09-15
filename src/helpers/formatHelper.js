function formatPrice(price = '') {
    if (!+price) return '';
    price = price + '';
    let deci;
    [price, deci] = price.split('.');
    var result =  "$" + price.split('').reverse().map(function(item, index) {
            return (index + 1) % 3 == 0 && (index + 1) != price.length ? ',' + item : item
        }).reverse().join('');
    if (deci) result += '.' + deci;
    return result;
};

module.exports = {
  formatPrice: formatPrice,

  showBeautifulNumber: function (number) {
      return formatPrice(number);
  },

  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  formatDate: function (dateStr) {
      var strs = dateStr.split("-");
      var monthIndex = parseInt(strs[1]) - 1;
      // return strs[1] + "-" + strs[0];
      return this.months[monthIndex] + " " + strs[0];
  },

  calculateRaisedPercentage: function (minimum_raise, amount_raised) {
      var percentage_raised = Math.round(amount_raised / minimum_raise * 100);
      if (!percentage_raised || percentage_raised < 20) percentage_raised = 20;
      return percentage_raised;
  },

	appendHttpIfNecessary(e) {
      // var $el = $('#website');
      var $el = $(e.target);
      var url = $el.val();
      if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        $el.val("http://" + url);
      }
    },
};
