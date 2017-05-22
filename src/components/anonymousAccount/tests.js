const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const Views = require('src/components/anonymousAccount/views.js');

describe('Login/Signup tests', () => {
  it('Login', () => {
    const view = new Views.login({
      el: '#content',
      model: {}
    });
    view.render();
  });
});