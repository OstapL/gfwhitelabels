'use strict'
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
        const stub = $.ajax;
        import routes from './route'
        new routes.campaignList();
        stub.called.eq.true;
    }),
    if('Campaign Detail', function() {
        // Check that $.ajax.get was called
        // Check that we have a show right data For both security types
        const stub = $.ajax;
        import routes from './route'
        new routes.campaignDetail();
        stub.called.eq.true;
    })
})
