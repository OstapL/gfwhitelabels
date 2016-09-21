const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const rules     = require('./rules.js');

describe('Attribute validation', function () {
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
    _(valid_urls).each((url) => {
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
    _(unvalid_urls).each((url) => {
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
});
