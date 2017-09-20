const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const PetPost = require('./models');

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




app.listen(process.env.PORT || 8080, () => {
	console.log("server is up and running")
}); //telling server what to listen

