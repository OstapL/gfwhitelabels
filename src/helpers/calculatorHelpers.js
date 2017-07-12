const getTypedValue = (input) => {
  const type = input.dataset.valueType || input.type;
  if (type === 'money')
    return app.helpers.format.unformatMoney(input.value);

  if (type === 'percent')
    return app.helpers.format.unformatPercent(input.value);

  return input.value;
};

module.exports = {
  calculateRevenueShare(data) {
    return data;
  },
  saveCalculatorField(saveTo, input) {
    const value = getTypedValue(input);
    const name = input.getAttribute('name');
    saveTo[name] = value;
  },
};