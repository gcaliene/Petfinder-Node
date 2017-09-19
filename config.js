exports.DATABASE_URL = process.env.DATABASE_URL || //heroku file
					   global.DATABASE_URL || // 
					   //'mongodb:localhost/'; //local database url video by ray to set up mongo
exports.PORT = process.env.PORT || 8080;


//crashes the app with error [nodemon] app crashed - waiting for file changes before starting...

