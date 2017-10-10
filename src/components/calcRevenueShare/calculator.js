const getPreviousSum = (data, index) => {
  let selectedRange = data.slice(2, index + 1);
  let sum = selectedRange.reduce((prev, current) => {
    return prev + current.annual;
  }, 0);
  return sum;
};

const calcAnnual = (raiseMoney, data) => {
  const sum = data.reduce((prev, current, idx) => {
    if (idx < 2)
      return 0;

    if (idx < data.length - 1)
      return prev + current.annual;

    return prev;
  }, 0);

  return raiseMoney * 2 - sum;
};

const calculator = {
  doCalculation(schema, data) {
    if (!app.validation.validate(schema, data))
      return false;

    let maxOfMultipleReturned = 0;
    let countOfMultipleReturned = 0;
    const { raiseMoney, nextYearRevenue, growLevel } = data;

    // calculate income for 10 years
    const outputData = [
      // set the first year
      {
        fundraise: raiseMoney,
      },
      // set the second year
      {
        revenue: nextYearRevenue,
      }
    ];
    // set all other year
    for (var i = 2; i < 11; i++) {
      const revenue = Math.ceil(outputData[i - 1].revenue * (1 + growLevel / 100));
      outputData[i] = {
        revenue,
        annual: Math.ceil(0.05 * revenue),
      };

      const prevSum = getPreviousSum(outputData, i);
      const helper = {
        sum: prevSum,
        divided: prevSum / raiseMoney
      };

      outputData[i].multiple = Math.min(parseFloat(helper.divided.toFixed(1)), 2);

      // change max value of multiple returned
      if (outputData[i].multiple > maxOfMultipleReturned)
        maxOfMultipleReturned = outputData[i].multiple;

      // skip adding maximum "multiple returned" value more then one time
      if (outputData[i].multiple >= 2) {
        countOfMultipleReturned += 1;
        if (countOfMultipleReturned > 1) {
          outputData[i].multiple = "";
          outputData[i].annual = "";
          continue;
        }
        if (countOfMultipleReturned === 1) {
          outputData[i].annual = calcAnnual(raiseMoney, outputData);
        }
      }

      outputData[i].total = Math.min(parseFloat(helper.sum).toFixed(1), 2 * raiseMoney);
    }

    return {
      outputData,
      maxOfMultipleReturned,
    };
  }
};

module.exports = calculator;