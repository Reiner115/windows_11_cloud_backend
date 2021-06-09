var express = require("express");
var app = express();
const auth = require("../Authentication/auth")

var myLogger = function (err , req, res, next) {
	
		console.log(" code : " + err.statusCode);
		console.log( " msg : " + err.mesg);
		console.log( "message : " + err.message);
		res.status( err.statusCode ).send( err );
		next();
	
  }
  
 


app.use( "/users" , require("./user.js") );

/*
app.use("/" , function(req , res , next ){
	var authorization = req.headers.authorization;
	if( authorization == undefined ){
		res.status( 401 ).send("token not found");
		return;
	}
	var token;
	if( authorization.split(" ")[0] == "Bearer" ){
		 token =  authorization.split(" ")[1];	
	}else  {
		token = authorization;
	}	
	
	try{
	
		var user = auth.verifyUser( token );
		
		req.user = user;
		next();
		
	}catch( err ){
		err.statusCode = 401;
		next(err);
		return;
	}

	
});
*/
app.use( "/meals/favs/" , require("./favs") );
app.use( "/meals" , require("./meals.js") );
app.use( "/categories" , require("./categories.js") );
app.use( "/orders" , require("./orders") );
app.use(myLogger)

module.exports = app;