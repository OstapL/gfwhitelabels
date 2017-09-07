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

const SKIP_KEY_CODES = [
  16,   //shift
  17,   //ctrl
  18,   //alt
  35,   //end
  36,   //home
  37,   //left arrow
  38,   //down arrow
  39,   //right arrow
  40,   //up arrow
  91,   //left window
  188,  //comma
  190,  //period
];

const filterNumberRx = /[^0-9\.\-]/g;


module.exports = {
  formatPrice: formatPrice,
  formatNumber: formatNumber,

  formatMoney(value) {
    const moneyString = String(value).replace(filterNumberRx, '');
    if (!moneyString)
      return '';

    const moneyValue = Number(moneyString);
    if (isNaN(moneyValue) || !moneyValue)
      return '';

    return '$' + moneyValue.toLocaleString('en-US');

  },

  unformatMoney(value) {
    if (!value)
      return '';

    const numberString = value.replace(filterNumberRx, '');
    if (!numberString)
      return '';

    const number = Number(numberString);
    if (isNaN(number))
      return '';

    return number;
  },

  unformatPrice(price) {
    return parseFloat(price.replace(/[\$\,]/g, ''));
  },

  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  formatDate: function (dateStr) {
      var strs = dateStr.split("-");
      var monthIndex = parseInt(strs[1]) - 1;
      // return strs[1] + "-" + strs[0];
      return this.months[monthIndex] + " " + strs[0];
  },

  formatMonthDate: function (dateStr) {
      var strs = dateStr.split("-");
      var monthIndex = parseInt(strs[1]) - 1;
      // return strs[1] + "-" + strs[0];
      return this.months[monthIndex] + " " + strs[2].split('T')[0];
  },

  appendHttpIfNecessary(e, https) {
    // var $el = $('#website');
      var $el = $(e.target);
      var url = $el.val();
      if (!url) return;
      if(https) {
        https = (https == true ? 'https://' : 'http://');
        url = url.replace('http://', 'https://');
        if (!url.startsWith(https)) {
          $el.val(https + url);
        }
      } else {
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
          $el.val("http://" + url);
        }
      }
  },

  ensureLinkProtocol(link, https=false) {
    if (!link)
      return link;

    let protocol = https ? 'https://' : 'http://';
    return protocol + link.replace(/http(s?)\:\/\//, '');
  },

  getWebsiteUrl(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.protocol + '//' +l.host;
  },

  formatAmount(amount) {
    amount = amount || 0
    
    if (typeof amount === 'string')
      amount = parseFloat(amount);

    if (amount < 1000)
      return '$' + amount;

    if (amount < 1000000)
      return '$' + Math.round(amount/1000) + 'K';

    if (amount < 1000000000)
      return '$' + (amount/1000000).toFixed(3) + 'M';

    return '$' + (amount / 1000000000).toFixed(2) + 'MM';
  },

  formatMoneyValue(e) {
    let val = parseInt(e.target.value.replace(/[\$\,]/g, ''));
    if (val) {
      e.target.value = '$' + val.toLocaleString('en-US');
      e.target.dataset.currentValue = val;
    }
  },

  formatMoneyInputOnKeyup(e) {
    const countChar = (str='', char='', to=str.length) => {
      let count = 0;
      for (let i = 0; i < to; i += 1)
        count += (str[i] === char) ? 1 : 0;

      return count;
    };

    const findRemovedChar = (oldString, newString) => {
      if (oldString.length <= newString.length)
        return -1;

      const length = Math.min(oldString.length, newString.length);
      for (let i = 0; i < length; i += 1) {
        if (oldString[i] !== newString[i])
          return i;
      }

      return -1;
    };

    const isDigit = (str) => {
      return /^[0-9]$/.test(str);
    };

    if (SKIP_KEY_CODES.includes(e.keyCode)) {
      e.target.dataset.prevCursor = e.target.selectionStart;
      return;
    }

    const positiveOnly = !!e.target.dataset.positiveOnly;

    let rawValue = e.target.value;
    const prevValue = e.target.dataset.prev || rawValue;
    let cursorPosition = e.target.selectionStart;
    const prevCursorPosition = Number(e.target.dataset.prevCursor || cursorPosition);
    const valueString = rawValue.replace(/[\$,]/g, '');

    let number = parseFloat(valueString);
    if (isNaN(number)) {
      e.target.dataset.prevCursor = e.target.selectionStart;
      return e.target.value = valueString.replace(/[^0-9\$,\.]/g, '');
    }

    if (positiveOnly)
      number = number < 0 ? Math.abs(number) : number;

    let cursorPositionFix = rawValue.startsWith('$') ? 0 : 1;
    const newValue = '$' + number.toLocaleString('en-US');

    e.target.value = newValue;
    e.target.dataset.prev = newValue;
    e.target.dataset.prevCursor = cursorPosition;

    const removedCharIdx = findRemovedChar(prevValue, rawValue);
    if (removedCharIdx >= 0) {
      const removedChar = prevValue[removedCharIdx];
      if (isDigit(removedChar)) {
        const prevValueCommaCount = countChar(prevValue, ',');
        const newValueCommaCount = countChar(newValue, ',');
        if (prevValueCommaCount !== newValueCommaCount) {
          cursorPositionFix += newValueCommaCount - prevValueCommaCount;
        }
      } else if (removedChar === ',') {
        //removed with delete
        if (prevCursorPosition === cursorPosition)
          cursorPositionFix += 1;
      }
    } else {  //char added
      const prevValueCommaCount = countChar(prevValue, ',');
      const newValueCommaCount = countChar(newValue, ',');
      if (prevValueCommaCount !== newValueCommaCount) {
        cursorPositionFix += newValueCommaCount - prevValueCommaCount;
      }
    }

    cursorPosition += cursorPositionFix;
    cursorPosition = cursorPosition <= 0 ? 1 : cursorPosition;
    e.target.setSelectionRange(cursorPosition, cursorPosition);
    e.target.dataset.prevCursor = cursorPosition;
  },

  formatPercent(value) {
    let numberString = String(value).replace(filterNumberRx, '');

    let numberValue = Number(numberString);
    if (isNaN(numberValue) || !numberValue)
      return '';

    return numberValue + '%';
  },

  unformatPercent(value) {
    const stringValue = String(value).replace(filterNumberRx, '');
    if (!stringValue)
      return '';

    return Number(stringValue);
  },

  formatPercentFieldOnKeyUp(e) {
    if (SKIP_KEY_CODES.includes(e.keyCode))
      return;

    const rawValue = e.target.value;
    const rawValueNumber = rawValue.replace(/[^0-9\,\.]/g, '');

    let number = parseFloat(rawValueNumber);
    if (isNaN(number))
      return e.target.value = '';

    let cursorPosition = e.target.selectionStart;

    let newValue = number + '%';
    e.target.value = newValue;
    e.target.setSelectionRange(cursorPosition, cursorPosition);
  }

};
