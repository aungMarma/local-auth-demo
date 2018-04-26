const   express    				= require("express"),
	    app        				= express(),
	    bodyParser 				= require("body-parser"),
	    mongoose   				= require("mongoose"),
	    User       				= require("./models/user"),
	    passport   				= require("passport"),
		localStrategy  			= require("passport-local"),
		passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo");
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// session (express-session) secret
app.use(require("express-session")({
	secret: "Be curious, excited and determinde, forget your progress, just keep working",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());

//   persistent login sessions
 // same as app.use(passport.authenticate('session'));
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES
app.get("/", function(req, res){
	res.render("home");
})
app.get("/secret", isLoggedIn,function(req, res){
	res.render("secret");
})

// 											AUTH ROUTEs
// ------------------------------------------------------------------------------------------------------
// show sign up form
app.get("/register", function(req, res){
	res.render("register");
})

// log user and show secret file
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		// returned user will have hashed password that was also saved in db
		if(err){
			console.log(err);
			return res.redirect("/register");   // return to get out
		}
		// authenticate user, store in session, give some privilege
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		})
	})
})


// show log in form
app.get("/login", function(req, res){
	res.render("login");
})

let loginObj = {successRedirect: "/secret", failureRedirect: "/login"};
app.post("/login", passport.authenticate("local", loginObj), function(req, res){});


app.get("/logout", function(req, res){
	// passport destroys all user data in session
	req.logout();   // logout method comes from password middleware
	res.redirect("/");
})


// custom middleware to check user logged or not
function isLoggedIn(req, res, next){
	// next: next thing that needs to be call
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Server started at", port);
})