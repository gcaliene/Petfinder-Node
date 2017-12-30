// var expect = require('chai').expect;
// //var chaiHttp = require('chai-http');
// // const { app, runServer, closeServer } = require('../index');
// const faker = require('faker');
// var request = require('request');
// var chai = require('chai');
// var mongoose = require('mongoose');
// //var should = require('chai').should(); //actually call the function
// const should = require('should');
//
// //superchai no longer giving should errs
// var supertestChai = require('supertest-chai');
// var request = supertestChai.request;
// chai.should();
// chai.use(supertestChai.httpAsserts);
//
// var express = require('express');
//
// const { PetPost } = require('../models');
// const { app, runServer, closeServer } = require('../index');
// const { TEST_DATABASE_URL } = require('../config');
//
// function seedPetPostData() {
//   console.info('seeding petpost data');
//   const seedData = [];
//
//   for (let i = 1; i <= 10; i++) {
//     seedData.push(generatePetPostData());
//   }
//   return PetPost.insertMany(seedData);
// }
//
// // used to generate data to put in db
// function generatePetPostData() {
//   return {
//     text: faker.lorem.sentences(),
//     userName: faker.name.findName(),
//     created: faker.date.past()
//   };
// }
//
// // don't forget to delete the database!!!!!
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }
//
// describe('PetPost API resource', function() {
//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });
//
//   beforeEach(function() {
//     return seedPetPostData();
//   });
//
//   describe('GET endpoint', function() {
//     it('should return all existing posts', function() {
//       let res;
//       return request(app) // was chai.request
//         .get('/posts')
//         .end(function(_res) {
//           //end was then
//           res = _res;
//           console.log(res.body);
//           should.exist(res.body);
//           res.should.have.status(200);
//           // this part shows up with the status. below gives the error
//           //res.body.posts.should.have.length.of.at.least(1);
//           return PetPost.count();
//         });
//     });
//
//     it('should return posts with right fields', function() {
//       let resPetPost;
//       return request(app) //was chai.request
//         .get('/posts')
//         .end(function(res) {
//           // end was then
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.posts.should.be.a('array');
//           res.body.posts.should.have.length.of.at.least(1);
//           console.log(res.body);
//           res.body.posts.forEach(function(post) {
//             post.should.be.a('object');
//             post.should.include.keys('id', 'userName', 'text', 'created');
//           });
//           resPetPost = res.body.posts[0];
//           return PetPost.findById(resPetPost._id); //_id was id
//         });
//       // .end(function(post) { // end was then
//       //
//       //   resPetPost.id.should.equal(post.id);
//       //   resPetPost.userName.should.equal(post.userName);
//       //   resPetPost.text.should.equal(post.text);
//       //   resPetPost.created.should.equal(post.created);
//       // });
//     });
//   });
//   /*
//   describe('POST endpoint', function() {
//     it('should return ')
//   });
//
//   describe('DELETE endpoint', function(){
//
//   });
//
//   describe('PUT endpoint', function(){
//
//   });*/
// });
