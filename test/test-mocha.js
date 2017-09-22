var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../index.js');
const faker = require('faker');
var request = require('request');


it('Main page content', function(){
	request('http://localhost:8080', function(error, response, body){
		expect(body).to.equal('In');
	});
});

/*
//this allows the should syntax available throughout this file
var should = chai.should();

var app = server.app;

var storage = server.storage;

chai.use(chaiHttp);


describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});
*/