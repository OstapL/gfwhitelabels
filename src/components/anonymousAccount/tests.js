const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const Views = require('src/components/anonymousAccount/views.js');

const userData = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'test@test.com',
  password: '1234',
  password1: '12345',
  password2: '12345',
};

describe('Login/Signup tests', () => {
  beforeEach(() => {
    api.makeRequestSpy = new sinon.spy();
    api.makeRequest = (url, method, data) => {
      api.makeRequestSpy(data);
      return {
        then(){
          return {
            fail() {
            },
          }
        },
      };
    }
  });
  it('Login form succeed', () => {
    new Views.login({
      el: '#content',
      model: {}
    }).render();
    const $loginForm = $('.login-form');
    $loginForm.find('input[name=email]').val(userData.email);
    $loginForm.find('input[name=password]').val(userData.password);

    $loginForm.submit();

    const data = api.makeRequestSpy.args[0][0];
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal(userData.email);
    expect(data.password).to.equal(userData.password);
  });
  it('Signup form succeed', () => {
    new Views.signup({
      el: '#content',
      model: {}
    }).render();

    const $signupForm = $('.signup-form');
    $signupForm.find('input[name=first_name]').val(userData.firstName);
    $signupForm.find('input[name=last_name]').val(userData.lastName);
    $signupForm.find('input[name=email]').val(userData.email);
    $signupForm.find('input[name=password1]').val(userData.password1);
    $signupForm.find('input[name=password2]').val(userData.password2);
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    $signupForm.submit();

    const data = api.makeRequestSpy.args[0][0];
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal(userData.email);
    expect(data.password1).to.equal(userData.password1);
    expect(data.password2).to.equal(userData.password2);
    expect(data.checkbox1).to.equal(1);
    expect(data.first_name).to.equal(userData.firstName);
    expect(data.last_name).to.equal(userData.lastName);
  });
  it('Popup Login form succeed', () => {
    const v = new Views.popupLogin({
      el: '#content',
      model: {}
    }).render();

    const $loginForm = $('#sign-in-form');
    $loginForm.find('input[name=email]').val(userData.email);
    $loginForm.find('input[name=password]').val(userData.password);

    $loginForm.submit();

    const data = api.makeRequestSpy.args[0][0];

    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal(userData.email);
    expect(data.password).to.equal(userData.password);
  });
  it('Popup Signup form succeed', () => {
    new Views.popupLogin({
      el: '#content',
      model: {}
    }).render();
    const $signupForm = $('#sign-up-form');
    $signupForm.find('input[name=email]').val(userData.email);
    $signupForm.find('input[name=password1]').val(userData.password1);
    $signupForm.find('input[name=password2]').val(userData.password2);
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    $signupForm.submit();

    const data = api.makeRequestSpy.args[0][0];
    expect(data.domain).to.equal('alpha.growthfountain.com');
    expect(data.email).to.equal(userData.email);
    expect(data.password1).to.equal(userData.password1);
    expect(data.password2).to.equal(data.password2);
    expect(data.checkbox1).to.equal(1);
  });
});