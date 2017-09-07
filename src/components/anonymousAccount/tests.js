const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;

const Views = require('src/components/anonymousAccount/views.js');
const socialAuth = require('src/components/anonymousAccount/social-auth.js');

const eventEmitter = Object.assign({}, Backbone.Events);

const inst = {};
const setData = app.user.setData;
app.user.setData = function(...args) {
  return setData.call(app.user, ...args).then(() => {
    eventEmitter.trigger('done');
  });
};

const stubMakeRequest = (response) => {
  api.makeRequest = sinon.stub(api, 'makeRequest');
  const dfr = $.Deferred();
  dfr.resolve(response);
  api.makeRequest.returns(dfr);
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

    socialAuth.login = sinon.stub(socialAuth, 'login');
    socialAuth.login.returns(new Promise((resolve) => {
      resolve(JSON.parse(JSON.stringify({ cancelled: false, data: fakeLoginResponse, })));
    }));

    inst.LoginView = new Views.login({
      el: '#content',
      model: {}
    });
    inst.LoginView.render();
  });

  afterEach(() => {
    inst.LoginView.destroy();
    delete inst.LoginView;
    $('#content').empty();
    api.makeRequest.restore();
    socialAuth.login.restore();
    localStorage.clear();
    eventEmitter.off('done');
  });

  it('Login form succeed', (done) => {
    const $loginForm = $('.login-form');
    const userData = {
      domain: 'alpha.growthfountain.com',
      email: 'test@test.com',
      password: 'qweqwe123',
      checkbox1: 1,
    };

    testHelpers.fillForm($loginForm, app.utils.pick(userData, ['email', 'password']));

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

  it('Should log-in via FB', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });
    inst.LoginView.$el.find('.btn-facebook').click();
  });

  it('Should log-in via LinkedIn', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });
    inst.LoginView.$el.find('.btn-linkedin').click();
  });

  it('Should log-in via Google', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });
    inst.LoginView.$el.find('.btn-google').click();
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

    socialAuth.login = sinon.stub(socialAuth, 'login');
    socialAuth.login.returns(new Promise((resolve) => {
      resolve(JSON.parse(JSON.stringify({ cancelled: false, data: fakeLoginResponse, })));
    }));

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
    socialAuth.login.restore();
    eventEmitter.off('done');
  });

  it('Sign-up form succeed', (done) => {
    const userData = {
      first_name: 'firstName',
      last_name: 'lastName',
      email: 'test@test.com',
      password1: 'qweqwe123',
      checkbox1: 1,
      domain: 'alpha.growthfountain.com',
    };

    const $signupForm = $('.signup-form');
    testHelpers.fillForm($signupForm, app.utils.omit(userData, ['checkbox1', 'domain']));
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);
    eventEmitter.off('done');
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

  it('Should sign-up via Facebook', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeLoginResponse);
      done();
    });

    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupView.$el.find('.btn-facebook').click();
  });

  it('Should sign-up via LinkedIn', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeLoginResponse);
      done();
    });

    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupView.$el.find('.btn-linkedin').click();
  });

  it('Should sign-up via Google', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeLoginResponse);
      done();
    });

    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupView.$el.find('.btn-google').click();
  });

  it('Should show validation message when not agreed with rules, click facebook button', () => {
    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupView.$el.find('.btn-facebook').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

  it('Should show validation message when not agreed with rules, click linkedin button', () => {
    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupView.$el.find('.btn-linkedin').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

  it('Should show validation message when not agreed with rules, click google button', () => {
    inst.SignupView.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupView.$el.find('.btn-google').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

});

describe('Sign-up popup', () => {
  const fakeSignupResponse = {
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
    stubMakeRequest(fakeSignupResponse);
    socialAuth.login = sinon.stub(socialAuth, 'login');
    socialAuth.login.returns(new Promise((resolve) => {
      resolve(JSON.parse(JSON.stringify({ cancelled: false, data: fakeSignupResponse, })));
    }));

    inst.SignupPopup = new Views.popupSignup();
    inst.SignupPopup.render();
  });

  afterEach(() => {
    inst.SignupPopup.destroy();
    delete inst.SignupPopup;
    api.makeRequest.restore();
    socialAuth.login.restore();
    eventEmitter.off('done');
  });

  it('Sign-up with valid data', (done) => {
    const userData ={
      first_name: 'Test',
      last_name: 'Test',
      email: 'test@test.com',
      password1: 'qweqwe123',
      domain: 'alpha.growthfountain.com',
      checkbox1: 1
    };
    const $signupForm = $('#sign-up-form');

    testHelpers.fillForm($signupForm, app.utils.omit(userData, ['checkbox1', 'domain']));
    $signupForm.find('input[name=checkbox1]').prop('checked', true);
    eventEmitter.off('done');
    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];
      expect(data).to.deep.equal(userData);

      const actual = readUserData();

      expect(actual.user).to.deep.equal(fakeSignupResponse);
      expect(actual.token).to.equal(fakeSignupResponse.token);
      expect(actual.cookieToken).to.equal(fakeSignupResponse.token);

      done();
    });
    $signupForm.submit();
  });

  it('Sign-up with empty credentials', () => {
    const $signupForm = $('#sign-up-form');
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    $signupForm.submit();

    expect(app.validation.errors).to.deep.equal({
      first_name: ['Is required', 'First Name must be at least 2 characters'],
      last_name: ['Is required', 'Last Name must be at least 2 characters'],
      email: ['Is required'],
      password1: ['Is required', 'Password must be at least 8 characters'],
    });
  });

  it('Should sign-up via Facebook', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeSignupResponse);
      done();
    });

    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupPopup.$el.find('.btn-facebook').click();
  });

  it('Should sign-up via LinkedIn', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeSignupResponse);
      done();
    });

    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupPopup.$el.find('.btn-linkedin').click();
  });

  it('Should sign-up via Google', (done) => {
    eventEmitter.on('done', () => {
      const actualData = readUserData();
      expect(actualData.user).to.deep.equal(fakeSignupResponse);
      done();
    });

    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', true);
    inst.SignupPopup.$el.find('.btn-google').click();
  });

  it('Should show validation message when not agreed with rules, click facebook button', () => {
    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupPopup.$el.find('.btn-facebook').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

  it('Should show validation message when not agreed with rules, click linkedin button', () => {
    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupPopup.$el.find('.btn-linkedin').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

  it('Should show validation message when not agreed with rules, click google button', () => {
    inst.SignupPopup.$el.find('[name=checkbox1]').prop('checked', false);
    inst.SignupPopup.$el.find('.btn-google').click();
    expect(app.validation.errors.checkbox1).to.include('You must agree to the terms before creating an account');
  });

});

describe('Log-in popup', () => {
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

    socialAuth.login = sinon.stub(socialAuth, 'login');
    socialAuth.login.returns(new Promise((resolve) => {
      resolve(JSON.parse(JSON.stringify({ cancelled: false, data: fakeLoginResponse, })));
    }));

    inst.LoginPopup = new Views.popupLogin({});
    inst.LoginPopup.render();
  });

  afterEach(() => {
    inst.LoginPopup.destroy();
    delete inst.LoginPopup;
    api.makeRequest.restore();
    socialAuth.login.restore();
    eventEmitter.off('done');
  });

  it('Log-in with valid data', (done) => {
    const userData = {
      email: 'test@test.com',
      password: 'qweqwe123',
      domain: 'alpha.growthfountain.com',
      checkbox1: 1,
    };

    const $loginForm = $('#sign-in-form');

    testHelpers.fillForm($loginForm, app.utils.omit(userData, ['domain']));
    eventEmitter.off('done');
    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];

      expect(data).to.deep.equal(userData);

      const actual = readUserData();

      expect(actual.user).to.deep.equal(fakeLoginResponse);
      expect(actual.token).to.equal(fakeLoginResponse.token);
      expect(actual.cookieToken).to.equal(fakeLoginResponse.token);

      done();
    });

    $loginForm.submit();
  });

  it('Log-in with empty email/password', () => {
    const $loginForm = $('#sign-in-form');

    $loginForm.submit();

    expect(app.validation.errors).to.deep.equal({
      email: ['Is required'],
      password: ['Is required', 'Password must be at least 8 characters'],
    });
  });

  it('Should log-in via Facebook', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });

    inst.LoginPopup.$el.find('.btn-facebook').click();
  });

  it('Should log-in via LinkedIn', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });
    inst.LoginPopup.$el.find('.btn-linkedin').click();
  });

  it('Should log-in via Google', (done) => {
    eventEmitter.on('done', () => {
      const data = readUserData();
      expect(data.user).to.deep.equal(fakeLoginResponse);
      done();
    });
    inst.LoginPopup.$el.find('.btn-google').click();
  });

});
