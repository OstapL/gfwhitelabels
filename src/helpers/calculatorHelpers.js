let __$plot = null;

const resizeHandler = (e) => {
  if (!__$plot)
    return;

  __$plot.resize();
  __$plot.setupGrid();
  __$plot.draw();
};


const helper = {
  bindResizeTo($plot) {
    if (__$plot)
      $(window).off('resize', resizeHandler);

    if ($plot) {
      __$plot = $plot;
      $(window).on('resize', resizeHandler);
    }
  },

  unbindResizeFrom($plot) {
    if (!$plot)
      return;
    
    if (!__$plot)
      return console.warn('resize handler wasn\'t bound to process $plot');

    if (__$plot !== $plot)
      return console.warn('resize handler was bound to process other plot resizing');

    $(window).off('resize', resizeHandler);
    __$plot = null;
  },

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