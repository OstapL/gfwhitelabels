var chai     = require('chai');
var sinon    = require('sinon');
var should   = chai.should();
var expect   = chai.expect;
var fs       = require('fs');
var request  = require('request');

const Route = require('src/components/campaign/route.js');

describe('Campaign Component', function() {
  it('Campaign List' , function() {
    // Check that $.ajax.get was called
    // Check that we have a show right data For both security types
    const data = require('./fixtures/list.json');
    new Route.list({collection: data});
    expect($('#campaignList .one_block .bottom_pr').html()).to.equal('<p>Price per share: $2.00</p><p>Number of shares: 125,000</p>');
    expect(ajaxStub.called).eq.true;
    ajaxStub.restore();
  }),
  it('Campaign Detail', function() {
    const companyData = require('./fixtures/detail.json');

    api.makeRequest = sinon.stub(api, 'makeRequest');
    api.makeRequest.withArgs(
      app.config.raiseCapitalServer + '/company',
      'OPTIONS'
    ).returns(
      Promise.resolve(companyData[0])
    );
    api.makeRequest.withArgs(
      app.config.raiseCapitalServer + '/' + companyData[1].slug
    ).returns(
      Promise.resolve(companyData[1])
    );
    api.makeRequest.withArgs(
      app.config.commentsServer + '/company/' + companyData[1].id
    ).returns(
      require('./fixtures/comments.json')
    );

    new Route.methods.detail(companyData[1].slug);
    // console.log(api.makeRequest);
    expect(api.makeRequest.callCount).to.equal(3);

  })
});
