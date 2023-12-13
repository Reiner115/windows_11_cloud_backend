var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const bcrypt = require("bcrypt");
const logger = require("../util/logger");
const SECRET = "mysecret";

function signIn( user ){

	var token = jwt.sign( user , SECRET  , {algorithm: 'HS256' , expiresIn :  60 *60 * 24 * 3  });

	return token;
}

function verifyUser( token  ){
	try{
		var result =  jwt.verify( token , SECRET , {algorithm: 'HS256'} );
		return result;
	}catch( err ){
		logger.error("token is not valid , user is not authorized");
		err.code = 401;
		err.msg = "cloud not verify user token"
		throw err;
	}
}


function hash( password) {
	
		var data = bcrypt.hashSync( password , bcrypt.genSaltSync() );
		return data;
	
}


function compare( password , hashedPassword ) {
	
	var data = bcrypt.compareSync( password , hashedPassword );
	return data;

}

module.exports = {
	verifyUser ,
	signIn ,
	hash ,
	compare 
}