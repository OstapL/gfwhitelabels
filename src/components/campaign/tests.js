var routes       = require('./route.js');

var chai     = require('chai');
var sinon    = require('sinon');
var should   = chai.should();
var expect   = chai.expect;
var fs       = require('fs');
var request  = require('request');


describe('Campaign Component', function() {
    it('Campaign List' , function() {
        // Check that $.ajax.get was called
        // Check that we have a show right data For both security types
        const data = require('./fixtures/list.json');
        const ajaxStub = sinon.stub(Backbone, "sync").yieldsTo(
          'success',
          data,
          'foo'
        );
        const r = new routes();
        const v = r.list();
        console.log(v.$el.html());
        expect(ajaxStub.called).eq.true;
        ajaxStub.restore();
    }),
    it('Campaign Detail', function() {
        // Check that $.ajax.get was called
        // Check that we have a show right data For both security types
        const stub = $.ajax;
        new routes.detail();
        stub.called.eq.true;
    })
})
