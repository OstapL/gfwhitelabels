module.exports = function(price = '') {
    if (!price) return '';
    price = price + '';
    return "$" + price.split('').reverse().map(function(item, index) {
            return (index + 1) % 3 == 0 && (index + 1) != price.length ? ',' + item : item
        }).reverse().join('');
};
