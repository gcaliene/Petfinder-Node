exports.DATABASE_URL = process.env.DATABASE_URL || 
					   global.DATABASE_URL || 
					   'mongodb://localhost:27017/fullstackcapstone';


exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-fullstackcapstone');

exports.PORT = process.env.PORT || 8080;



