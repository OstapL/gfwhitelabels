function formatPrice(price = '') {
    // here we need to take care of passing the number of 0
    // if we got a 0 we should return $0, not empty string
    // if (!+price) return ''; doesn't take care the situation above, thus I use the following one.
    // Arthur Yip 2016-9-14
    if (!price && !(price === 0)) return '';

    price = price + '';
    price = price.replace(/,/g, '');
    let deci;
    [price, deci] = price.split('.');
    var result =  "$" + price.split('').reverse().map(function(item, index) {
            return (index + 1) % 3 == 0 && (index + 1) != price.length ? ',' + item : item
        }).reverse().join('');
    if (deci) result += '.' + deci;
    return result;
};

function formatNumber(price = '') {
    if (!price && !(price === 0)) return '';

    price = price + '';
    price = price.replace(/,/g, '');
    var result =  price.split('').reverse().map(function(item, index) {
            return (index + 1) % 3 == 0 && (index + 1) != price.length ? ',' + item : item
        }).reverse().join('');
    return result;
};

module.exports = {
  formatPrice: formatPrice,
  formatNumber: formatNumber,

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
