const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;

const Views = require('src/components/anonymousAccount/views.js');
const eventEmitter = _.extend({}, Backbone.Events);

const inst = {};
const setData = app.user.setData;
app.user.setData = function(...args) {
  setData.call(app.user, ...args).then(() => {
    eventEmitter.trigger('done');
  });
};

const stubMakeRequest = (response) => {
  api.makeRequest = sinon.stub(api, 'makeRequest');
  api.makeRequest.returns(new Promise((resolve) => {
    resolve(response);
  }));
};

const readUserData = () => {
  return {
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    cookieToken: app.cookies.get('token'),
  }
};

describe('Log-in page', () => {
  const fakeLoginResponse = {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNzYsImZpcnN0X25hbWUiOiJWbGFkaW1pciIsImxhc3RfbmFtZSI6IkNoYWdpbiIsInVzZXJfaXAiOiIxNzIuMTcuMC4xIiwic2l0ZV9pZCI6NH0.kXh56z80TpRL0wwztKlPZ9en1YnTe2Hy22pbD_aiG6E',
    id: 176,
    first_name:'Vladimir',
    last_name: 'Chagin',
    image_data: {
      id: 6862,
      mime:'image/jpeg',
      name:'reportazh-dromru-s-pervogo-v-istorii-formuly-1-gran-pri-rossii-avtonovosti_9952.jpg',
      urls: {
        main: '/9a4a37906118be57e46c5a3fe77936d37f59056d.jpg',
        '50x50': '/ba4c924fbda4d92aea02686263c60d15369d4a74.jpg',
        origin: '/baa6377228bf7c661cc1f4465f47561306a9368c.jpg',
      },
      site_id:12
    },
    info:[{
      company_id: 940,
      campaign_id:940,
      formc_id: 940,
      owner_id:176,
      user_id: 176,
      is_paid: false,
      company: 'mac',
      role: 0
    }]
  };

  beforeEach(() => {
    stubMakeRequest(fakeLoginResponse);
    inst.LoginView = new Views.login({
      el: '#content',
      model: {}
    });
    inst.LoginView.render();
  });

  afterEach(() => {
    inst.LoginView.undelegateEvents();
    delete inst.LoginView;
    $('#content').empty();
    api.makeRequest.restore();
    eventEmitter.off('done');
  });

  it('Login form succeed', (done) => {
    const $loginForm = $('.login-form');
    const userData = {
      domain: 'alpha.growthfountain.com',
      email: 'test@test.com',
      password: 'qweqwe123',
    };

    testHelpers.fillForm($loginForm, _.pick(userData, 'email', 'password'));

    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];
      expect(data).to.deep.equal(userData);

      //check localStorage/cookie values
      const actual = readUserData();
      expect(actual.user).to.deep.equal(fakeLoginResponse);
      expect(actual.token).to.equal(fakeLoginResponse.token);
      expect(actual.cookieToken).to.equal(fakeLoginResponse.token);

      done();
    });

    $loginForm.submit();
  });

  it('Invalid email/password', () => {
    const $loginForm = $('.login-form');
    const userData = {
      email: '1234',
      password: '1234',
    };

    testHelpers.fillForm($loginForm, userData);

    $loginForm.submit();

    expect(app.validation.errors.email).to.include('Invalid email');
    expect(app.validation.errors.password).to.include('Password must be at least 8 characters');
  });

});

describe('Sign-up page', () => {
  const fakeLoginResponse = {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNzYsImZpcnN0X25hbWUiOiJWbGFkaW1pciIsImxhc3RfbmFtZSI6IkNoYWdpbiIsInVzZXJfaXAiOiIxNzIuMTcuMC4xIiwic2l0ZV9pZCI6NH0.kXh56z80TpRL0wwztKlPZ9en1YnTe2Hy22pbD_aiG6E',
    id: 176,
    first_name:'Vladimir',
    last_name: 'Chagin',
    image_data: {
      id: 6862,
      mime:'image/jpeg',
      name:'reportazh-dromru-s-pervogo-v-istorii-formuly-1-gran-pri-rossii-avtonovosti_9952.jpg',
      urls: {
        main: '/9a4a37906118be57e46c5a3fe77936d37f59056d.jpg',
        '50x50': '/ba4c924fbda4d92aea02686263c60d15369d4a74.jpg',
        origin: '/baa6377228bf7c661cc1f4465f47561306a9368c.jpg',
      },
      site_id:12
    },
    info:[{
      company_id: 940,
      campaign_id:940,
      formc_id: 940,
      owner_id:176,
      user_id: 176,
      is_paid: false,
      company: 'mac',
      role: 0
    }]
  };

  beforeEach(() => {
    stubMakeRequest(fakeLoginResponse);

    inst.SignupView = new Views.signup({
      el: '#content',
      model: {}
    });
    inst.SignupView.render();
  });
  afterEach(() => {
    inst.SignupView.undelegateEvents();
    $('#content').empty();
    delete inst.SignupView;
    api.makeRequest.restore();
    eventEmitter.off('done');
  });

  it('Sign-up form succeed', (done) => {
    const userData = {
      first_name: 'firstName',
      last_name: 'lastName',
      email: 'test@test.com',
      password1: 'qweqwe123',
      password2: 'qweqwe123',
      checkbox1: 1,
      domain: 'alpha.growthfountain.com',
    };

    const $signupForm = $('.signup-form');
    testHelpers.fillForm($signupForm, _.omit(userData, 'checkbox1', 'domain'));
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    eventEmitter.on('done', () => {
      const actualData = api.makeRequest.args[0][2];
      expect(actualData).to.deep.equal(userData);

      const actual = readUserData();

      expect(actual.user).to.deep.equal(fakeLoginResponse);
      expect(actual.token).to.equal(fakeLoginResponse.token);
      expect(actual.cookieToken).to.equal(fakeLoginResponse.token);

      done();
    });
    $signupForm.submit();
  });
});

describe('Sign-up/Log-in popups', () => {
  const fakeLoginResponse = {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNzYsImZpcnN0X25hbWUiOiJWbGFkaW1pciIsImxhc3RfbmFtZSI6IkNoYWdpbiIsInVzZXJfaXAiOiIxNzIuMTcuMC4xIiwic2l0ZV9pZCI6NH0.kXh56z80TpRL0wwztKlPZ9en1YnTe2Hy22pbD_aiG6E',
    id: 176,
    first_name:'Vladimir',
    last_name: 'Chagin',
    image_data: {
      id: 6862,
      mime:'image/jpeg',
      name:'reportazh-dromru-s-pervogo-v-istorii-formuly-1-gran-pri-rossii-avtonovosti_9952.jpg',
      urls: {
        main: '/9a4a37906118be57e46c5a3fe77936d37f59056d.jpg',
        '50x50': '/ba4c924fbda4d92aea02686263c60d15369d4a74.jpg',
        origin: '/baa6377228bf7c661cc1f4465f47561306a9368c.jpg',
      },
      site_id:12
    },
    info:[{
      company_id: 940,
      campaign_id:940,
      formc_id: 940,
      owner_id:176,
      user_id: 176,
      is_paid: false,
      company: 'mac',
      role: 0
    }]
  };

  beforeEach(() => {
    stubMakeRequest(fakeLoginResponse);
    inst.SignupPopup = new Views.popupLogin({});
    inst.SignupPopup.render();
  });

  afterEach(() => {
    inst.SignupPopup.undelegateEvents();
    delete inst.SignupPopup;
    $('#content').empty();
    api.makeRequest.restore();
    eventEmitter.off('done');
  });

  it('Log-in with valid data', (done) => {
    const userData = {
      email: 'test@test.com11111',
      password: 'qweqwe123',
      domain: 'alpha.growthfountain.com',
    };

    const $loginForm = $('#sign-in-form');

    testHelpers.fillForm($loginForm, _.omit(userData, 'domain'));

    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];

      console.log(data);
      console.log(userData);

      expect(data).to.deep.equal(userData);

      const actual = readUserData();

      expect(actual.user).to.deep.equal(fakeLoginResponse);
      expect(actual.token).to.equal(fakeLoginResponse.token);
      expect(actual.cookieToken).to.equal(fakeLoginResponse.token);

      done();
    });

    $loginForm.submit();
  });

  it('Sign-up with valid data', (done) => {
    const userData ={
      email: 'test@test.com',
      password1: 'qweqwe123',
      password2: 'qweqwe123',
      domain: 'alpha.growthfountain.com',
      checkbox1: 1
    };
    const $signupForm = $('#sign-up-form');

    testHelpers.fillForm($signupForm, _.omit(userData, 'checkbox1', 'domain'));
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];
      expect(data).to.deep.equal(userData);

      const actual = readUserData();

      expect(actual.user).to.deep.equal(fakeLoginResponse);
      expect(actual.token).to.equal(fakeLoginResponse.token);
      expect(actual.cookieToken).to.equal(fakeLoginResponse.token);

      done();
    });

    $signupForm.submit();
  });

  // it('Log-in with empty email/password', () => {
  //   const $loginForm = $('#sign-in-form');
  //
  //   $loginForm.find('[name=email]').val('');
  //   $loginForm.find('[name=password]').val('');
  //
  //   $loginForm.submit();
  //
  //   const data = inst.makeRequestSpy.args[0][0];
  //
  //   expect(data).to.deep.equal({
  //     email: '',
  //     password:'',
  //     domain: 'alpha.growthfountain.com',
  //     checkbox1: 1,
  //   });
  // });
  //
  // it('Sign-up with not checked checkbox', () => {
  //   const $signupForm = $('#sign-up-form');
  //
  //   $signupForm.submit();
  //
  //   expect(app.validation.errors).to.deep.equal({
  //     checkbox1: ['You must agree to the terms before creating an account'],
  //   });
  // });
  //
  // it('Sign-up with checked checkbox and empty credentials', () => {
  //   const $signupForm = $('#sign-up-form');
  //   $signupForm.find('input[name="checkbox1"]').prop('checked', true);
  //
  //   $signupForm.submit();
  //   const data = inst.makeRequestSpy.args[0][0];
  //
  //   expect(data).to.deep.equal({
  //     checkbox1: 1,
  //     domain: 'alpha.growthfountain.com',
  //     first_name: '',
  //     last_name: '',
  //     email: '',
  //     password1: '',
  //     password2: '',
  //   });
  // });
});
