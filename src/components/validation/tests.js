'use strict'
const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const rules     = require('./rules.js');


describe('Attribute validation', function() {
    it('Required', function() {
      let attr = {
        label: "City",
      };

      let data = {
        test: ''
      };


      // if required = false we don't have to get any error
      expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();

      // if required = true we should see error
      expect(rules.required.bind(rules, 'test', true, attr, data)).to.throw(rules.messages.required.replace('{0}', attr.label));

      // For string we dont have to get any exception
      data.test = 'value';
      expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
      expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();

      // For number we dont have to get any exception
      data.test = 342;
      expect(rules.required.bind(rules, 'test', false, attr, data)).to.not.throw();
      expect(rules.required.bind(rules, 'test', true, attr, data)).to.not.throw();
    });

    it('Url', function() {
      let attr = {
        label: "Linkedin",
        type: 'url',
        required: true,
      };

      let data = {
        test: 'http://arthuryip.xyz'
      };


      // if email field, but we don't find a email pattern, throw error
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
      // Make the url wrong
      data.test = 'http://arthuryip';
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();

      // if the field is not required, it should not throw any error either way
      attr.required = false;
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
      data.test = 'http://arthuryip.xyz';
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
    });

    it('Email', function() {

      // change the type to email
      attr.type = 'email';
      data.test = 'arthur.hotmail.com';
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
      data.test = 'arthur_yip@hotmail.com';
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();

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

      attr.type = 'number';
      data.test = 'dddd';
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.throw();
      data.test = 12345;
      expect(rules.regex.bind(rules, 'test', attr, data, attr.type)).to.not.throw();
      data.test = "54321";
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
