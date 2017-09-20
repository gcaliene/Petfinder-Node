exports.DATABASE_URL = process.env.DATABASE_URL || 
					   global.DATABASE_URL || 
					   'mongodb://localhost:27017/fullstackcapstone'
exports.PORT = process.env.PORT || 8080;


//crashes the app with error [nodemon] app crashed - waiting for file changes before starting...

