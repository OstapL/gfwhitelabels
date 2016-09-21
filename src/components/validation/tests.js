'use strict'
const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;
const rules     = require('./rules.js');


describe('Attribute validation', function() {
    before() {
    },

    it('Require' , function() {
      const attr = {
        label: "City"
        required: true
      }
      const data = {
        test: ''
      }

      expect(rules.required('test', false, data, attr)).to.not.throw();
      expect(rules.required('test', true, data, attr)).to.throw();
      data.test = 'value';

      expect(rules.required('test', false, data, attr)).to.not.throw();
      expect(rules.required('test', true, data, attr)).to.not.throw();
    }),
})
