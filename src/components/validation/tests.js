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
    })
});
