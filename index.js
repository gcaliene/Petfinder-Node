const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const {PORT, DATABASE_URL}= require('./config');
const {PetPost} = require('./models');



const app = express();
mongoose.Promise =global.Promise;
mongoose.connect(DATABASE_URL)

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());


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

