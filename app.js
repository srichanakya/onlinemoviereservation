var express = require("express");
var app = express();
// var methodOverride = require("method-override");
var user = require('./models/user');
var movie = require('./models/movie');
var mongoose = require('mongoose');
var passport = require("passport");
var bodyParser = require('body-parser');
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");



mongoose.connect("mongodb://localhost:27017/movie_demo",{ useNewUrlParser: true });
app.use(express.static("public"));
// app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(require("express-session")({
 secret: 'This is very hard to learn....',
  resave: false,
  saveUninitialized: false
}));
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Routes

// Home Route

app.get("/",function(req,res)
{
	res.redirect("/home");
});

app.get("/home",function(req,res)
{
	console.log(req.user);
	movie.find({},function(err,allMovies)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/");
		}
		else
		{
			res.render("home",{moviedetail:allMovies,currentuser:req.user});
		}
	})
});

// Add Movie to Db

app.get("/addMovie",function(req,res)
{
	res.render("addmovie");
});
app.post("/addMovie",function(req,res)
{
	var newmovie = new movie({
	mtitle :req.body.title,
	rating : req.body.rating,
	language : req.body.language,
	duration : req.body.duration,
	release : req.body.release,
	hero : req.body.hero,
	heroine : req.body.heroine,
	director : req.body.director,
	music : req.body.music,
	poster:req.body.poster
	});
	
	movie.create(newmovie,function(err,movieAdded)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log(movieAdded);
			res.redirect("/home");
		}
	})
});



// user login

app.get("/login",function(req,res)
{
	res.render("login");
});
app.post("/login",passport.authenticate("local",
{
	successRedirect:"/home",
	failureRedirect:"/register"
}),function(req,res)
{});


app.get("/logout",function(req,res)
{
	req.logout();
	res.redirect("/");
});






// show movie details

app.get("/movie/:id",isLoggedIn,function(req,res)
{
	movie.findById(req.params.id,function(err,movieDetails)
	{
		if(err)
		{
			console.log(err);
			res.redirect('/home');
		}
		else
		{
			res.render("moviedetails",{moviedetails:movieDetails,currentuser:req.user});
		}
	})
});

// seat layout booking tickets

app.get("/book/:id",isLoggedIn,function(req,res)
{
	movie.findById(req.params.id,function(err,currentMovie)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("book",{currentmovie:currentMovie,currentuser:req.user});
		}
	})
	
});

app.post("/book/confirm/:id",function(req,res)
{
	
	var detail={seatno:req.body.seat,payment:req.body.amount};
	console.log(req.user.phone);
	console.log(detail.payment+" "+detail.seatno);

	mysms();
	async function mysms(){
	const way2sms = require('way2sms');
	var text = "Dear Customer, Your Movie successfully booked";
 	cookie = await way2sms.login('9492657850', 'prateesh'); 
	await way2sms.send(cookie, req.user.phone, text); 
	
	}



	
	movie.findById(req.params.id,function(err,moviebooked)
	{
	if(err)
	{
		console.log(err);
	}
	else
	{

	
		res.render("confirm",{movieconfirm:moviebooked,moviedetails:detail,currentuser:req.user});
	}
	});
});

// User Registration
app.get("/register",function(req,res)
{
	res.render("register");
});

app.post("/register",function(req,res)
{
	var newUser = new user({
		name:req.body.name,
		username:req.body.username,
		email:req.body.email,
		phone:req.body.phone
	});

	user.register(newUser,req.body.password,function(err,userregister)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log(userregister);
		}
		passport.authenticate("local")(req,res,function()
		{
			res.redirect("/home");
		});
	});
});


// middleware

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated()){
		return next();
	}
		
		res.redirect("/login");
	
}

app.listen(3000,function()
{
	console.log("Server Started");
})