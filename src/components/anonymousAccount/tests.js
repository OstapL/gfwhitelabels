const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const Views = require('src/components/anonymousAccount/views.js');

const userData = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'test@test.com',
  password: 'qweqwe123',
  password1: 'qweqwe123',
  password2: 'qweqwe123',
};

const fakeLoginResponse = '{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNzYsImZpcnN0X25hbWUiOiJWbGFkaW1pciIsImxhc3RfbmFtZSI6IkNoYWdpbiIsInVzZXJfaXAiOiIxNzIuMTcuMC4xIiwic2l0ZV9pZCI6NH0.kXh56z80TpRL0wwztKlPZ9en1YnTe2Hy22pbD_aiG6E","id":176,"first_name":"Vladimir","last_name":"Chagin","image_data":{"id":6862,"mime":"image/jpeg","name":"reportazh-dromru-s-pervogo-v-istorii-formuly-1-gran-pri-rossii-avtonovosti_9952.jpg","urls":{"main":"/9a4a37906118be57e46c5a3fe77936d37f59056d.jpg","50x50":"/ba4c924fbda4d92aea02686263c60d15369d4a74.jpg","origin":"/baa6377228bf7c661cc1f4465f47561306a9368c.jpg"},"site_id":12},"info":[{"company_id":940,"campaign_id":940,"formc_id":940,"owner_id":176,"user_id":176,"is_paid":false,"company":"mac","role":0}]}'

describe('Log-in/Sign-up', () => {
  beforeEach(() => {
    api.emitter = _.extend({}, Backbone.Events);
    const updateLocalStorage = app.user.updateLocalStorage;

    app.user.updateLocalStorage = function(...args) {
      updateLocalStorage.call(app.user, args);
      api.emitter.trigger('done');
    };

    api.makeRequestSpy = new sinon.spy();
    api.makeRequest = (url, method, data) => {
      api.makeRequestSpy(data);
      return {
        then(cb) {
          cb(JSON.parse(fakeLoginResponse));
          return {
            fail() {}
          };
        }
      };
    };
  });

  describe('Log in with valid data', () => {
    it('Login form succeed', (done) => {
      new Views.login({
        el: '#content',
        model: {}
      }).render();
      const $loginForm = $('.login-form');
      $loginForm.find('input[name=email]').val(userData.email);
      $loginForm.find('input[name=password]').val(userData.password);

      api.emitter.on('done', () => {
        const data = api.makeRequestSpy.args[0][0];
        expect(data.domain).to.equal('alpha.growthfountain.com');
        expect(data.email).to.equal(userData.email);
        expect(data.password).to.equal(userData.password);

        //check cookie
        const userStr = localStorage.getItem('user');
        const tokenStr = localStorage.getItem('token');

        const diff = require('deep-diff').diff;
        const responseObj = JSON.parse(fakeLoginResponse);
        const userObj = JSON.parse(userStr);

        expect(responseObj).to.deep.equal(userObj);
        expect(responseObj.token).to.equal(tokenStr);
        done();
      });
      $loginForm.submit();
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
  });

  describe('Sign up with valid data', () => {
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

  describe('Log in with invalid data', () => {
    beforeEach(() => {
      new Views.login({
        el: '#content',
        model: {}
      }).render();
    });

    it('Invalid email', () => {
      const $loginForm = $('.login-form');

      $loginForm.find('input[name=email]').val('123');
      $loginForm.find('input[name=password]').val(userData.password);

      $loginForm.submit();

      expect(app.validation.errors.email).to.include('Invalid email');
    });

    it('Invalid password', () => {
      const $loginForm = $('.login-form');

      $loginForm.find('input[name=email]').val(userData.email);
      $loginForm.find('input[name=password]').val('123');

      $loginForm.submit();

      expect(app.validation.errors.password).to.include('Password must be at least 8 characters');
    });
  });

  describe('Sign up with invalid data', () => {
    beforeEach(() => {
      new Views.signup({
        el: '#content',
        model: {}
      }).render();
    });

    it('Sign up with empty requried fields', () => {
      const $signupForm = $('.signup-form');

      $signupForm.find('input[name=first_name]').val('');
      $signupForm.find('input[name=last_name]').val('');
      $signupForm.find('input[name=email]').val('');
      $signupForm.find('input[name=password1]').val('');
      $signupForm.find('input[name=password2]').val('');
      $signupForm.find('input[name="checkbox1"]').prop('checked', false);

      $signupForm.submit();

      expect(app.validation.errors.first_name).to.include('Is required');
      expect(app.validation.errors.last_name).to.include('Is required');
      expect(app.validation.errors.email).to.include('Is required');
      expect(app.validation.errors.password1).to.include('Is required');
      expect(app.validation.errors.password2).to.include('Is required');
      expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');

    });

    it('Sign up with invalid email', () => {
      const $signupForm = $('.signup-form');

      $signupForm.find('input[name=first_name]').val(userData.firstName);
      $signupForm.find('input[name=last_name]').val(userData.lastName);
      $signupForm.find('input[name=email]').val('qwer');
      $signupForm.find('input[name="checkbox1"]').prop('checked', true);

      $signupForm.submit();

      expect(app.validation.errors.email).to.include('Invalid email');
      expect(app.validation.errors.password1).to.include('Is required');
      expect(app.validation.errors.password2).to.include('Is required');
    });
  });

});
