'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const app = express();
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PetPost } = require('./models');
const jsonParser = bodyParser.json();
const moment = require('moment');

const path = require('path');
const session = require('express-session');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { PORT, DATABASE_URL, JWT_SECRET } = require('./config');
const db = mongoose.connection; //just added this might delete, but not affecting outcome

mongoose.Promise = global.Promise;

const { Users } = require('./users/');

// Logging
app.use(morgan('common'));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use(express.static('public0'));

// A protected endpoint for testing
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use(bodyParser.urlencoded({ extended: false })); //make extended false. find out why.
app.use(bodyParser.json()); //initializes body parser

app.use(morgan('common'));
app.use(bodyParser.json());

///////////// POST ///////////////////////////
app.post('/posts', (req, res, next) => {
  console.log('hello from backend');
  console.log(req.body);
  const post = new PetPost({
    text: req.body.text,
    userName: req.body.userName,
    created: req.body.created,
    city: req.body.city,
    googleMapUrl: req.body.googleMapUrl
  });
  post.save(function(err, post) {
    if (err) {
      return next(err);
    }
    res.json(201, post);
  });
  console.log(post);
});

/////////vvv GET Requests vvv////////////////vvGETvv/////////////
app.get('/posts', (req, res) => {
  PetPost.find()
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});

//for currentUser from user models
app.get('/currentUser', jwtAuth, (req, res) => {
  console.log(req.user.username);
  res.send(req.user.username); //just sends back user
});

///////DELETE
app.delete('/posts/:id', (req, res) => {
  console.log(req.params.id);
  PetPost.findByIdAndRemove(req.params.id, error => {
    if (error) {
      res.send(error);
    } else {
      PetPost.find()
        .then(posts => {
          res.json(posts.map(post => post.apiRepr()));
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'something went wrong' });
        });
    }
  });
});

//PUT
app.put(`/posts/:id`, jsonParser, (req, res) => {
  console.log(req.body);
  console.log(req.params.id);

  PetPost.update(
    { _id: req.params.id },
    {
      text: req.body.text,
      userName: req.body.userName
    },
    err => {
      //issue was that it wasn't updating the name field, i was using name rather than userName on this line.
      if (err) {
        res.send(err);
      } else {
        PetPost.find()
          .then(posts => {
            res.json(posts.map(post => post.apiRepr())); //its reading the code but not updating?
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong' });
          });
      }
    }
  );

  //res.status(204).end();
});

// catch-all endpoint if client makes request to non-existent endpoint
// app.use('*', function(req, res) {
//   res.status(404).json({ message: 'Not Found' });
// });

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Time to work! Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later. gives error if not used.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('I guess this means you are done. Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node index.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
