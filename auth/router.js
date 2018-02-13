'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  // res.setHeader('Authorization', authToken);
  // console.log(req);
  // console.log(res.setHeader);
  // // res.set('Authorization', authToken);
  // console.log('=============');
  // console.log(res.req);
  // console.log('-----------------------hhh-----');

  res.json({ authToken });
  //res.redirect('/app.html');
  //console.log(authToken); //delete this line
});

const jwtAuth = passport.authenticate('jwt', { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.get('/logout', function(req, res) {
  req.logout();

  res.redirect('/index.html');
});

module.exports = { router };
