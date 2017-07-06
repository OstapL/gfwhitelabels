const chai     = require('chai');
const { expect } = chai;
const sinon    = require('sinon');
const request  = require('request');

const calculator = require('./calculator.js');
const Views = require('./views.js');

const validCalculatorData = {
  raiseMoney: 1234,
  nextYearRevenue: 1234,
  growLevel: 123,
};

const validOutputData = {

};

const invalidCalculatorData = {
  raiseMoney: -1,
  nextYearRevenue: 0,
  growLevel: -1,
};

const inst = {};

describe('Payback Share Calculator', () => {
  before(() => {

  });

  after(() => {

  });

  beforeEach(() => {
    inst.View = new Views.step2();
    inst.View.render();
  });

  afterEach(() => {
    inst.View.undelegateEvents();
    delete inst.View;
  });

  it('Calculator ViewProcess invalid input data', () => {
    const $form = $('form.js-calc-form');
    $form.find('[name=raiseMoney]').val(invalidCalculatorData.raiseMoney);
    $form.find('[name=nextYearRevenue]').val(invalidCalculatorData.nextYearRevenue);
    $form.find('[name=growLevel]').val(invalidCalculatorData.growLevel);

    $form.submit();

    expect(app.validation.errors).to.deep.equal({
      raiseMoney: ['Please, enter positive number'],
      nextYearRevenue: ['Please, enter positive number'],
      growLevel: ['Please, enter positive number'],
    });
  });

  it('Calculator component on valid data', () => {

  });

  it('Calculator component on invalid data', () => {

  });

  it('Calculate Capital raise', () => {
    // const $form = $('form.js-calc-form');
    // $form.find('[name=raiseMoney]').val(invalidCalculatorData.raiseMoney);
    // $form.find('[name=nextYearRevenue]').val(invalidCalculatorData.nextYearRevenue);
    // $form.find('[name=growLevel]').val(invalidCalculatorData.growLevel);
    //
    // $form.submit();
    //
    // expect(app.cache.payBackShareCalculator).to.deep.equal({
    //
    // });
  });
});
