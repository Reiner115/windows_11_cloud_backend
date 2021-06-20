const con = require("../db/connection");

function insertFav( userId , mealId ){
	return new Promise( function( resolve , reject ){
		con.query( "INSERT INTO `favs`(`mealId`, `userId`, `createdAt`, `updatedAt`) VALUES ( ? , ? , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )" ,
		[ mealId , userId ] ,
		function( err , result ){
			if( err ){
				err.statusCode = 500;
				err.message = "could not insert into fav";
				reject( err );
			}
			resolve( result );
		}
		);
	});
}

function deleteFav( userId , mealId ){
	return new Promise( function( resolve , reject ){
		con.query( "DELETE FROM `favs` WHERE mealId = ? AND userId = ?" ,
		[ mealId , userId ] ,
		function( err , result ){
			if( err ){
				err.statusCode = 500;
				err.message = "could not insert into fav";
				reject( err );
			}
			resolve( result );
		}
		);
	});
}

function getFavs( userId , offset , limit ){
	return new Promise( function( resolve , reject ){
		console.log(`the user id is : ${userId}`);
		con.query( "select * ,  ( select count(*) from favs where favs.userId = ? and meals.id = favs.mealId  ) as  favs from favs join meals on meals.id = favs.mealId where favs.userId = ? limit ? , ? " ,
		 [userId , userId  , offset , limit ] ,
		function( err , result ){
			if( err ){
				err.statusCode = 500;
				err.message = "could not get  favs meals";
				reject( err );
			}
			console.log("getfavs");
			console.log( result );
			resolve( result );
		}
		);
	});
}

module.exports={
	insertFav , deleteFav , getFavs
}