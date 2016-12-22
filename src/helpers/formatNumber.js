module.exports = function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
};