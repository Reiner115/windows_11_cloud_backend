const e = require("express");
var connection = require("../db/connection.js");
async function getUsers(  ){
	 return new Promise( (resolve , reject )=>{
		connection.query("select * from users" , ( err , data )=>{
			if( err ){
				reject( err );
			}else{
				resolve( data );
			}
		}); 	
	 });
}

async function getUserById( id ){
	return new Promise( (resolve , reject )=>{
	   connection.query("select * from users where id = ?"  , id , ( err , data )=>{
		   if( err ){
			   reject( err );
		   }else{
			   resolve( data );
		   }
	   }); 	
	});
}

async function getUserByEmail( email  ){

	return new Promise(
		function( resolve , reject ){
			connection.query("SELECT * FROM users WHERE email = ?", email , function( err , data){
				if( err){
					reject( err );
				}else{
					resolve( data );
				}
			})
		}
	);

}

async function insertUser( user  ){
	var sql = "INSERT INTO `users`(`id`, `name`, `email`, `password`, `gender`, `city`, `address`, `latitude`"
	+", `longitude`, `createdAt`, `updatedAt`) VALUES ( NULL ,?,?,?,?,?,?,?,?,  CURRENT_TIMESTAMP ,  CURRENT_TIMESTAMP )";
	var userArray = [];
	userArray.push( user.name );
	userArray.push( user.email );
	userArray.push( user.password );
	userArray.push( user.gender );
	userArray.push( user.city );
	userArray.push( user.address );
	userArray.push( user.latitude );
	userArray.push( user.longitude );

	return new Promise( (resolve , reject )=>{
	   connection.query( sql  , userArray , ( err , data )=>{
		   if( err ){
			   if( err.code == "ER_DUP_ENTRY" ){
					var err = Error("the entered email already exsits") ;
					err.statusCode = 409;
					reject ( err )
				}else{
					reject( err )
				}	
			   
		   }else{
			   resolve( data );
		   }
	   }); 	
	});
}


async function checkEmail( email ){
	return new Promise(function(resolve , reject ){

	
		connection.query("select * from users where email = ? " , [email] , ( err , data )=>{
			if( err ){
				console.log(err);	
				var err = Error("error when trying to checkemail") ;
				err.statusCode = 500;
				reject( err )
			}else{
				resolve(data);
			}
		});
	});
}







module.exports = {
	insertUser ,
	getUsers ,
	getUserById ,
	isValidUser ,
	getUserByEmail, 
	checkEmail
}


function isValidEmail( email ){
	var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	return regex.test( email ) ?  null :  "email is not valid";
}
function isValidName( name ){
	var regex = /\b([a-zA-Z0-9]{3,30})+/gm;
	return regex.test( name ) ?  null :  "the user name is not valid";
}
function isValidpassword( password ){
	var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
	return regex.test( password ) ?  null :  "the password  is not valid";
}
function isMatchingPasswords( password , repeatedPassword ){
	 return password.match( repeatedPassword ) ? null : "password and repeated password does not match"; 
}

function isValidUser(  user ){

	if( isValidName( user.name ) != null ){
		return isValidName( isValidName( user.name ) );
	}
	if( isValidEmail( user.email ) != null ){
		
		return isValidEmail( user.email );
	}
	if( isValidpassword( user.password ) != null ){
		return isValidpassword( user.password );
	}
	if( isMatchingPasswords( user.password , user.confirmationPassword ) != null ){
		return isMatchingPasswords( user.password , user.confirmationPassword );
	}
	return true;
}