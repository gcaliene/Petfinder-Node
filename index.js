const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const {PetPost} = require('./models');
const jsonParser = bodyParser.json();
const app = express();




var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');


const {PORT, DATABASE_URL}= require('./config');

var db = mongoose.connection; //just added this might delete

mongoose.Promise =global.Promise;

//The following code added from passport tutorial
var routes = require('./routes/index');
var users = require('./routes/users');
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Express session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave: true
}));


//Passport initialization : not working had to put in routes folder, but will leave in here until otherwise noted
app.use(passport.initialize());
app.use(passport.session());

//express validator
// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars for flash
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);



//end of code tutorial
app.use(bodyParser.urlencoded({ extended: false})); //tutorial says to make extended false
app.use(bodyParser.json());//initializes body parser

//app.use(express.static('public')); will use the tutorial method above
app.use(morgan('common'));
app.use(bodyParser.json());


app.post('/posts', (req, res) => {
	var post = new PetPost()

	post.text = req.body.text,
	post.userName = req.body.userName,
	post.created = new Date(),

	post.save((err, record) => {
		if(err) {
			res.send(err)
		}
		res.json(record)
	})
});

app.get('/posts', (req, res) => {
	PetPost
		.find()
		.then(posts => {
			res.json(posts.map(post => post.apiRepr()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

app.delete('/posts/:id', (req, res) => {
	console.log(req.params.id);
	PetPost.findByIdAndRemove(req.params.id, (error) => {
		if (error){
			res.send(error);
		} else {
			PetPost
			.find()
			.then(posts => {
				res.json(posts.map(post => post.apiRepr()));
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({error: 'something went wrong'});
			});
		}
	})
});

app.put(`/posts/:id`, jsonParser, (req, res) => {
	console.log(req.body);
	console.log(req.params.id);

	PetPost.update({ _id: req.params.id }, {text: req.body.text,
		userName: req.body.userName}, (err) => { //issue was that it wasn't updating the name field, i was using name rather than userName on this line.
			if (err) {
				res.send(err);
			} else {
				PetPost
				.find()
				.then(posts => {
					res.json(posts.map(post => post.apiRepr()));//its reading the code but not updating?
				})
				.catch(err => {
					console.error(err);
					res.status(500).json({error: 'something went wrong'});
				});
			}
		});


	//res.status(204).end();
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
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
// use it in our integration tests later.
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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

//app.listen(process.env.PORT || 8080, () => {
//	console.log("server is up and running")
//}); //telling server what to listen

