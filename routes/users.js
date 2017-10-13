var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
var expressValidator = require("express-validator");


//Passport initialization wasn't happening because i left this in server code and wasn't routing to here.
app.use(passport.initialize());
app.use(passport.session());
//Why use router vs app.get? because I use app get with my primary rest api and router for registration/login

//app.use(morgan('common'));
router.use(bodyParser.urlencoded({ extended: false }));//this was causing the issue: TypeError: the name was undefined

//model route
var User = require("../models/user");

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

	/*if (errors){
		console.log('yes');
	} else{
		console.log('no');
	}*/

	if(errors){
		res.render("register",{
			errors:errors
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

});


//passportImplementation - getUserByUsername
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



router.post("/login",
  passport.authenticate("local", {successRedirect:"/users/home", failureRedirect:"/users/login",failureFlash: true}),//second parameter is an object and options from documentation
  function(req, res) {
    res.redirect("/users/home");
  });

router.get("/logout", function(req, res){
	req.logout();

	req.flash("success_msg", "You are logged out");

	res.redirect("/users/login");
});

module.exports = router;








