const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const Views = require('src/components/anonymousAccount/views.js');

describe('Login/Signup tests', () => {
  it('Login form', () => {
    new Views.login({
      el: '#content',
      model: {}
    }).render();
    const $loginForm = $('.login-form');
    $loginForm.find('input[name=email]').val('test@test.com');
    $loginForm.find('input[name=password]').val('qweqwe123');

    const data = $loginForm.serializeJSON();
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal('test@test.com');
    expect(data.password).to.equal('qweqwe123');
  });
  it('Signup form', () => {
    new Views.signup({
      el: '#content',
      model: {}
    }).render();

    const $signupForm = $('.signup-form');
    $signupForm.find('input[name=email]').val('test@test.com');
    $signupForm.find('input[name=password1]').val('qweqwe123');
    $signupForm.find('input[name=password2]').val('qweqwe123');
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    const data = $signupForm.serializeJSON();
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal('test@test.com');
    expect(data.password1).to.equal('qweqwe123');
    expect(data.password2).to.equal(data.password1);
    expect(data.checkbox1).to.equal(1);
  });
  it('Popup Login form', () => {
    new Views.popupLogin({
      el: '#content',
      model: {}
    }).render();
    const $loginForm = $('#sign-in-form');
    $loginForm.find('input[name=email]').val('test@test.com');
    $loginForm.find('input[name=password]').val('qweqwe123');

    const data = $loginForm.serializeJSON();
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal('test@test.com');
    expect(data.password).to.equal('qweqwe123');
  });
  it('Popup Signup form', () => {
    new Views.popupLogin({
      el: '#content',
      model: {}
    }).render();
    const $signupForm = $('#sign-up-form');
    $signupForm.find('input[name=email]').val('test@test.com');
    $signupForm.find('input[name=password1]').val('qweqwe123');
    $signupForm.find('input[name=password2]').val('qweqwe123');
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    const data = $signupForm.serializeJSON();
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal('test@test.com');
    expect(data.password1).to.equal('qweqwe123');
    expect(data.password2).to.equal(data.password1);
    expect(data.checkbox1).to.equal(1);
  });
});