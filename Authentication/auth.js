var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const bcrypt = require("bcrypt");

const SECRET = "mysecret";
const salt = "MohamedAdam";
function signIn( user ){

	var token = jwt.sign( user , SECRET  , {algorithm: 'HS256' });
	return token;
}

function verifyUser( token  ){
	try{
		return jwt.verify( token , SECRET , {algorithm: 'HS256'} );
	}catch( err ){
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