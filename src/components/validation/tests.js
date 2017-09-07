const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const rules     = require('./rules.js');

describe('Attribute validation', function () {``
  it('Required', function () {
    let attr = {
      label: 'City',
    };

    let data = {
      test: '',
    };

    // if required = false we don't have to get any error
    expect(rules.required.bind(rules, 'test', false, attr, data)).to.not
      .throw();

    // if required = true we should see error
    expect(rules.required.bind(rules, 'test', true, attr, data)).to
      .throw(rules.messages.required.replace('{0}', attr.label));

    // For string we dont have to get any exception
    data.test = 'value';
    expect(rules.required.bind(rules, 'test', false, attr, data)).to.not
      .throw();
    expect(rules.required.bind(rules, 'test', true, attr, data)).to.not
      .throw();

    // For number we dont have to get any exception
    data.test = 342;
    expect(rules.required.bind(rules, 'test', false, attr, data)).to.not
      .throw();
    expect(rules.required.bind(rules, 'test', true, attr, data)).to.not
      .throw();
  });

  it('Url', function () {
    let attr = {
      label: 'Linkedin',
      type: 'url',
    };

    let data = {
      test: '',
    };

    // empty URL test
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();

    // valid urls
    let valid_urls = ['http://arthuryip.xyz', 'https://arthuryip.xyz', 'http://www.ya.pro', ];
    valid_urls.forEach((url) => {
      data.test = url;
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
    });

    // unvalid urls
    let unvalid_urls = [
      // 'ftp://arthuryip.xyz', -- this should not be accepted
      'ssh://arthuryip.xyz',
      'www.ya.pro',
      'beta.com',
      'mail@mail.com',
      'http://arthuryip',
    ];
    unvalid_urls.forEach((url) => {
      data.test = url;
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
    });
  });

  it('Email', function () {

    let attr = {
      label: 'Email',
      type: 'email',
    };

    let data = {
      test: '',
    };

    // Empty set should work without error
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();

    // Wrong email
    data.test = 'arthur_yip.hotmail.com';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();

    // Right email
    data.test = 'arthur_yip@hotmail.com';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
  });

  it('Money', function () {

    let attr = {
      label: 'Money',
      type: 'money',
    };

    let data = {
      test: '',
    };

    attr.type = 'money';
    data.test = 'sfdsfs';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
    data.test = '123,45';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
    data.test = '400,000';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
    data.test = '400,123.45';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
    data.test = '400,123.4';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
  });

  it('Number', function () {

    let attr = {
      label: 'Number',
      type: 'number',
    };

    let data = {
      test: '',
    };

    attr.type = 'number';
    data.test = 'dddd';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
    data.test = 12345;
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
    data.test = '54321';
    expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();

    // // if required = true we should see error
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.throw(rules.messages.required.replace('{0}', attr.label));

    // // For string we dont have to get any exception
    // data.test = 'value';
    // expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();

    // // For number we dont have to get any exception
    // data.test = 342;
    // expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();
  });

  it('Form Check', function () {

    const validation = require('./validation.js');
    let dataJson = {
      college: "",
      email: "brian@trunkclub.com",
      facebook: "",
      first_name: "Brian",
      bio: '12313213',
      growup: "",
      last_name: "Spaly",
      linkedin: "https://www.linkedin.com/in/brianspaly",
    };

    let fields = {
      first_name: {
        type: 'string',
        label: 'First Name',
        placeholder: 'John',
        required: true,
      },
      last_name: {
        type: 'string',
        label: 'Last Name',
        placeholder: 'Jordon',
        required: true,
      },
      title: {
        type: 'string',
        label: 'Title',
        placeholder: 'CEO',
        required: true,
      },
      email: {
        type: 'email',
        label: 'Email',
        placeholder: 'imboss@comanpy.com',
        required: true,
      },
      bio: {
        type: 'text',
        label: 'Bio',
        placeholder: 'At least 150 characters and no more that 250 charactes',
        required: true,
      },
      growup: {
        type: 'string',
        label: 'Where did you grow up',
        placeholder: 'City',
        required: false,
      },
      state: {
        type: 'choice',
        required: true,
        label: '',
      },
      college: {
        type: 'string',
        label: 'Where did you attend college',
        placeholder: 'College/University',
      },
      linkedin: {
        type: 'url',
        label: 'LinkedIn',
        placeholder: 'https://linkedin.com/',
      },
      facebook: {
        type: 'url',
        label: 'Facebook',
        placeholder: 'https://facebook.com/',
      },
      /*
      photo: {
        type: 'dropbox',
        label: 'Profile Picture',
      },
      */
    };

    validation.validate(fields, dataJson);
    expect(validation.errors.title[0]).to.be.equal('Is required');
    expect(validation.errors.state[0]).to.be.equal('Is required');
    dataJson.title = 'Title';
    dataJson.state = 'State';
    expect(validation.validate(fields, dataJson)).to.be.true;

    // // if required = true we should see error
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.throw(rules.messages.required.replace('{0}', attr.label));

    // // For string we dont have to get any exception
    // data.test = 'value';
    // expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();

    // // For number we dont have to get any exception
    // data.test = 342;
    // expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
    // expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();
  });
});
