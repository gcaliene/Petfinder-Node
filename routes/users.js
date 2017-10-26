const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//const app = express();
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const {BasicStrategy} = require("passport-http");
const {Stategy: JwtStrategy, ExtractJwt} = require("passport-jwt");
//const passportJWT = require("passport-jwt");
//const ExtractJwt = passportJWT.ExtractJwt;
//vr JwtStrategy = passportJWT.Strategy;
const jwt = require('jsonwebtoken');//this was missing before


const config =require("../config");
const {JWT_SECRET} = require ("../config");

//Passport initialization wasn't happening because i left this in server code and wasn't routing to here.
router.use(passport.initialize());
router.use(passport.session());
//Why use router vs app.get? because I use app get with my primary rest api and router for registration/login

router.use(bodyParser.urlencoded({ extended: false }));//this was causing the issue: TypeError: the name was undefined
router.use(bodyParser.json());

//model route
var User = require("../models/user"); //should users be in {}?

//register route 
router.get("/register",function(req,res){
	console.log("GET worked");
	res.render("register");
});

//login route 
router.get("/login",function(req,res){
	res.render("login");
});

//Home - My Petfinder Route
router.get("/home", ensureAuthenticated, function(req,res){
	console.log("going to the dashboard")
	res.render("home");
})
//only logged in users can see this page
function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error_msg", "You need to log in first")
		res.redirect("/users/login");
	}
};

// Register User
/*app.post('/register', (req, res) => {
	var User = new User()

	user.name = req.body.name,
	console.log(req);
	user.email = req.body.email;
	user.username = req.body.username;
	user.password = req.body.password;
	user.password2 = req.body.password2;



});
*/
router.post("/register", function(req, res){
	//console.log('?????????????')
	//console.log(req);
	const stringFields = ['username', 'password'];
	const nonStringField = stringFields.find(field =>
	  (field in req.body) && typeof req.body[field] !== 'string'
	);
	if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
	}
	
	const explicitlyTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicitlyTrimmedFields.find(field =>
	  req.body[field].trim() !== req.body[field]
	);

	if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 7,
            // bcrypt truncates after 72 characters, so let's not give the illusion
            // of security by storing extra (unused) info
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
            'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField]
                      .min} characters long`
                : `Must be at most ${sizedFields[tooLargeField]
                      .max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }


	var name = req.body.name;
	console.log(req.body);
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	// Validation
	req.checkBody("name", "Name is required").notEmpty();
	req.checkBody("email", "Email is required").notEmpty();
	req.checkBody("email", "Email is not valid").isEmail();
	req.checkBody("username", "Username is required").notEmpty();
	req.checkBody("password", "Password is required").notEmpty();
	req.checkBody("password2", "Passwords do not match").equals(req.body.password);

	var errors = req.validationErrors();

	return User
		.find({username})
		.count()
		.then(count => {
			if (count > 0) {
				// There is an existing user with the same username
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Username already taken',
					location: 'username'
				});
			} else {
				var newUser = new User({
					name: name,
					email:email,
				 	username: username,
					password: password
				});
				 	//going to use that createuser model 
				User.createUser(newUser, function(err, user){
					 if(err) throw err;
					console.log(user);
	 			});
			req.flash("success_msg", "You are registered and can now login");
			res.redirect("/users/login");
			}
	  
	   })
	   .catch(err => {
			// Forward validation errors on to the client, otherwise give a 500
			// error because something unexpected has happened
			if (err.reason === 'ValidationError') {
				
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
	   });
		 
	   
	   

// 	if(errors){
// 		res.render("register",{
// 			errors:errors
// 		});
// 	} else {
// 		var newUser = new User({
// 			name: name,
// 			email:email,
// 			username: username,
// 			password: password
// 		});
// 		//going to use that createuser model 
// 		User.createUser(newUser, function(err, user){
// 			if(err) throw err;
// 			console.log(user);
// 		});

// 		req.flash("success_msg", "You are registered and can now login");

// 		res.redirect("/users/login");
// 	}

 });


//passportImplementation - getUserByUsername. this is the thinkful strategy
passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: "User Not Registered"});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: "Invalid password"} );
   		}
   	});
	});
}));



passport.serializeUser(function(user, done){
	done(null,user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user){
		done(err, user);
	});
});

const createAuthToken = user => {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: "HS256"
	});
};


router.post("/login", passport.authenticate("local"),//second parameter is an object and options from documentation	
	function(req, res) {
		const authToken = createAuthToken(req.user.apiRepr());
		console.log(authToken);
		//res.json({authToken}); this will render the authtoken on the page
		res.redirect("/users/home");
		
	}
);

router.post(
	"/refresh",
	// The user exchanges an existing valid JWT for a new one with a later
	// expiration
	passport.authenticate("jwt", {session: false}),
	(req, res) => {
		const authToken = createAuthToken(req.user);
		res.json({authToken});
	}
);

router.get("/logout", function(req, res){
	req.logout();

	req.flash("success_msg", "You are logged out");

	res.redirect("/users/login");
});

module.exports = router;
//module.exports = {jwtStrategy};








