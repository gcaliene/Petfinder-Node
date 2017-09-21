const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const PetPost = require('./models');
const jsonParser = bodyParser.json();
const app = express();

const {PORT, DATABASE_URL}= require('./config');

mongoose.Promise =global.Promise;
mongoose.connect('mongodb://gerson:12345@ds141524.mlab.com:41524/fullstackcapstone');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello')
});

app.post('/posts', (req, res) => {
	const newPost = new PetPost()

	newPost.text = req.body.text
	newPost.userName = req.body.userName
	newPost.created = new Date()

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
})

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
})


app.listen(process.env.PORT || 8080, () => {
	console.log("server is up and running")
}); //telling server what to listen

