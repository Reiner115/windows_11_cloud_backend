const router = require("express").Router();
const connection = require("../db/connection.js");
const User = require("../models/user.js");
const auth = require("../Authentication/auth")



router.post('/login' , function(req, res , next ) {
	console.log("sorry , youe email is less than expected");
	
	var email = req.body.email;
	var password = req.body.password;
	
	if( email == undefined || password == undefined ){
		res.status(401)
		res.send("email or password is wrong");
		return;
	}else{
		
		User.getUserByEmail( email )
		.then( function( data ){
			if( data.length == 0 ){
				res.status(401)
				res.send("email or password is wrong");
				return;
			}
			
			var user = data[0]
			var result ;
			try{
			
			result = auth.compare( password , user.password );
			
			}catch( err){
				
				err.msg = "could not compare passwored with hasshed password";
				err.statusCode = 500;
				return next( err );
			}
			
			if( result == true ){
				delete user.password;
				try{
					var newUser = JSON.parse(JSON.stringify(user) )
					var token = auth.signIn( newUser );
					newUser.token = token;
					res.send( newUser );
					return;
					
				}catch( err ){
					err.statusCode = 500;
					err.message = "could not parse json or could not create jwt token";
					return next( err );
				}
				
			}else{
				res.status(401)
				res.send("email or password is wrong");
				return; 
			}
		})
		.catch( next );
	}
  });


	
router.get("/" , ( req , res )=>{
	User.getUsers().then( data =>{
		console.log( data );
		res.send( data );
	}).catch( err =>{
		console.log( err );
		res.send( err );
	});
});

/*

router.get("/:id" , ( req , res )=>{

	User.getUserById( req.params.id ).then( data =>{
		console.log( data );
		res.send( data );
	}).catch( err =>{
		console.log( err );
		res.send( err );
	});
	
});


router.get("/:name" , ( req , res )=>{

	User.getUsersByName( req.params.name ).then( data =>{
		res.send( data );
	}).catch( err =>{
		res.send( err );
	});
});
*/


router.post("/checkEmail" , (req , res , next)=>{

	var email = req.body.email;
	console.log(email);
	if( email == undefined ){
		res.status( 400 ).send("email variable not found");
		return;
	}
	User.checkEmail( email ).then( (data)=>{
		if( data.length > 0){
			
			res.status(409).send("found");
		}
		res.send("not found");
		return;
	}).catch(next);

});

router.post("/signup" , ( req , res , next )=>{
	
	var newUser = req.body;

	
	//var validUser = User.isValidUser( newUser );
	
	// if( validUser != true ){
	// 	res.status(400).send( validUser );
	// }

	try{
		var hashedPassword = auth.hash( newUser.password );
	}catch( err ){
	
		err.statusCode = 500
		err.msg = "error in signing in , could not hash tha password";
		return next( err );
			
	}

	delete newUser.confirmationPassword;
	newUser.password = hashedPassword;
	
	
	User.checkEmail( newUser.email ).then( (data)=>{
		if( data.length > 0){
			res.status(409).send("found");
			return;
		}
		
	
		User.insertUser( newUser ).
		then( data =>{
			
			var id = data.insertId;
			return User.getUserById( id );
		}).then( data =>{
			try{
				var object = JSON.parse( JSON.stringify(data[0] ) );
				var userToken = auth.signIn( object );	
				var user = data[0];
				user.token = userToken;
				delete user.password;
				delete user.confirmationPassword;
				res.send( user );
				return;
			}catch( err ){
				err.statusCode = 500
				err.msg = "error in signing in ";
				return next( err );
			}
	
		}).catch( next );

	}).catch(next);

	
	

	

});

router.put("/" , ( req , res )=>{	

});



router.delete("/" , ( req , res )=>{

	

});

module.exports = router;

