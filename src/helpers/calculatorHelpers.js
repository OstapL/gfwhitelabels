const helper = {
  readCalculatorData(calculatorName, defaultData={}) {
    const stringData = localStorage.getItem(calculatorName);
    return stringData ? JSON.parse(stringData) : defaultData;
  },

  saveCalculatorData(calculatorName, data) {
    if (!data)
      return;

    localStorage.setItem(calculatorName, JSON.stringify(data));
  },

  getTypedValue(input) {
    const type = input.dataset.valueType || input.type;
    if (type === 'money')
      return app.helpers.format.unformatMoney(input.value);

    if (type === 'percent')
      return app.helpers.format.unformatPercent(input.value);

    return input.value;
  },

  calculateRevenueShare(data) {
    return data;
  },

  saveCalculatorField(calculatorName, input) {
    const data = helper.readCalculatorData(calculatorName);
    const value = helper.getTypedValue(input);
    const name = input.getAttribute('name');
    data[name] = value;
    helper.saveCalculatorData(calculatorName, data);
  },

};

module.exports = helper;