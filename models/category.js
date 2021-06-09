var con = require("../db/connection.js");

async function insertCategory( category ){
	return new Promise( function( reslolve , reject ){
		con.query("INSERT INTO `categorys`(`id`, `name`, `desc`, `picture`, `createdAt`, `updatedAt`) VALUES "+
		"( NULL  , ? , ? , ? , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )" , 
		
		[ category.name , category.desc , category.picture ],
		 function( err , data){

			if( err ){
				err.statusCode = 500;
				err.msg = "could not insert category into database";
				reject( err );
			}else{
				reslolve( data );
			}

		});
	});
}

async function getAllCategorys(  ){
	return new Promise( function( reslolve , reject ){
		con.query("select * from categorys"  , function( err , data){

			if( err ){
				err.statusCode = 500;
				err.msg = "could not get categories from database";
				reject( err );
			}else{
				reslolve( data );
			}

		});
	});
}



module.exports = {
	insertCategory ,
	getAllCategorys
}