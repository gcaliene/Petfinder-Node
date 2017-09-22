const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const {PetPost} = require('./models');
const jsonParser = bodyParser.json();
const app = express();

const {PORT, DATABASE_URL}= require('./config');


mongoose.Promise =global.Promise;
mongoose.createConnection('mongodb://gerson:12345@ds141524.mlab.com:41524/fullstackcapstone');
mongoose.createConnection('mongodb://localhost/fullstackcapstone');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());


app.post('/posts', (req, res) => {
	const newPost = new PetPost()

	newPost.text = req.body.text,
	newPost.userName = req.body.userName,
	newPost.created = new Date(),

	newPost.save((err, record) => {
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
	PetPost.delete(req.params.id);
	console.log(`Deleted post \` ${req.params.id}\``);
	res.status(204).end();
});

app.put(`/posts/:id`, jsonParser, (req, res) => {
	const requiredFields = ['text', 'name', 'id'];
	for( let i=0; i<requiredFields; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`updating shopping list item \` ${req.params.id}\``);

	PetPost.update({
		id: req.params.id,
		text: req.body.text,
		name: req.body.userName,
	});
	res.status(204).end();
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

