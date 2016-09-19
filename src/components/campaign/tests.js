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
        );
        const r = new routes();
        r.list();
        expect($('#campaignList .one_block .bottom_pr').html()).to.equal('<p>Price per share: $2.00</p><p>Number of shares: 125,000</p>');
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
