const e = require("express");
var connection = require("../db/connection.js");

function getMealsByCategory( userId , catId , offset , limit ){
	return new Promise( function( resolve , reject ){
		connection.query( "select meals.id,  meals.name ,  meals.desc ,  meals.picture ,  meals.price ,  meals.rate ,  meals.offer ,  meals.categoryId ,  meals.createdAt ,  meals.updatedAt ,   ( select count(*) from favs where favs.userId = ? and meals.id = favs.mealId  ) as  favs from meals left join favs on meals.id = favs.mealId where categoryId = ? GROUP BY meals.id ORDER BY meals.id limit ? , ? " ,
		 [ userId , catId , offset , limit] , function( err , data ){
			if( err ){
				err.msg = "could not  get meals by category";
				err.statusCode = 500;
				reject( err );
			}else{
				resolve( data );
			}
		});
	});
}

function getOffersByLimits( userId , offset , limit ){
	console.log(`userid ${userId} offset ${offset} limit ${limit}`);
	var sql = "SELECT * ,   ( select count(*) from favs where favs.userId = ? and meals.id = favs.mealId  ) as  favs  FROM meals left join favs on meals.id = favs.mealId WHERE offer GROUP BY meals.id ORDER BY meals.id limit ? , ? "

	
	return new Promise( function( resolve , reject ){
		connection.query( sql ,  [ userId , offset , limit ] , function( err , data ){
			console.log( data);
			if( err ){
				err.msg = "could not get offers by limit";
				err.statusCode = 500;
				reject( err );
			}else{

				resolve( data );
			}
		});
	});
}

function getOffers( ){

	return new Promise( function( resolve , reject ){
		connection.query( "SELECT * FROM meals WHERE offer" , limits , function( err , data ){
			console.log( data);
			if( err ){
				err.msg = "could not get meals by offer ";
				err.statusCode = 500;
				reject( err );
			}else{
				resolve( data );
			}
		});
	});
}

async function getMealById( userId , mealId ){
	return new Promise( function( resolve , reject ){
		connection.query( "SELECT * FROM meals WHERE id = ?" , mealId , function( err , meal ){
			if( err ){
				err.msg = "could not get meal by mealId";
				err.statusCode = 500;
				reject( err );
			}else{
				if( meal[0] == undefined ){
					var err = Error("meal not found");
					err.statusCode = 404;
					err.message = "meal not found";
					err.msg = "meal not found";
					reject( err );
					return;
				}
				
				
				connection.query( "SELECT * FROM contents WHERE mealId = ?" , mealId , function( err , contents ){
					if( err ){
						err.msg = "could not get contents by mealId";
						err.statusCode = 500;
						reject( err );
					}else{
						connection.query( "SELECT * FROM `favs` WHERE userId = 1 and mealId = 1" , [userId , mealId] , function( err , favs ){
							if( err ){
								err.msg = "could not get favs by mealId";
								err.statusCode = 500;
								reject( err );
							}else{
								if( contents != undefined )
								meal[0].contents = contents;
								if( favs != undefined )
								//meal[0].favs = favs;
								if( favs.length == 0 )
									meal[0].favs = false;
								else 
									meal[0].favs = true;	
								resolve(meal[0]);
							}
						});
					}
				});	
			}
		});
	});
}


function getMeals( userId , offset , limit ){
	return new Promise(
		function( resolve , reject ){
			connection.query("SELECT `id`, `name`, `desc`, `picture`, `price`, `rate`, `offer`, `categoryId` , ( select count(*) from favs where favs.userId = ? and meals.id = favs.mealId  ) as  favs FROM `meals` LEFT JOIN favs on meals.id = favs.mealId GROUP BY meals.id ORDER BY meals.id limit ? , ?" , [ userId , offset , limit ] , function( err , data ){
				if( err ){
					err.statusCode = 500;
					err.msg = "error getting meals";
					reject( err );
					return;
				}
				resolve( data );
			});
		}
	);
}



function insertMeal( meal ){
	const sql = "INSERT INTO `meals`(`id`, `name`, `desc`, `picture`, `price`, `rate`, `offer` ,"+
	"`categoryId`, `createdAt`, `updatedAt`) VALUES "+
	"(  NULL , ? , ? , ? , ? , ? , ? , ? , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )";
	var preparedData = [];
	preparedData.push( meal.name );
	preparedData.push( meal.desc );
	preparedData.push( meal.picture );
	preparedData.push( meal.price );
	preparedData.push( meal.rate );
	if( meal.offer == undefined || meal.offer == "" || isNaN(meal.offer)  )
	meal.offer =  null;
	preparedData.push( meal.offer );
	preparedData.push( meal.categoryId );

	return new Promise( function( resolve , reject ){
		connection.beginTransaction(function(err){
			if( err ){
				connection.rollback(function() {
					err.msg = "error inserting Meal in insertMeal , transaction rolledback";
					err.statusCode = 500;
					reject( err )
				});
				return;
			}
			connection.query ( sql , preparedData , function( err , result ){
				if( err ){
					err.msg = "could not get insert meal";
					err.statusCode = 500;
					reject( err );
					return;
				}else{
					resolve( data );
				}
				console.log( "result of meal insertion ");
				console.log( result	);
			var mealId = result.insertId;
			var preparedResult  = preapareContentsInsertionSql( mealId , meal.contents );
			var sql = preparedResult[0];
			var data = preparedResult[1];
			connection.query( sql ,  data , function(err, secondResult) {
				console.log("mealId");
				console.log(mealId);
				console.log( "err is : ");
				console.log( err );
				console.log( "result is : ");
				console.log( secondResult );
				
				if (err) { 
					connection.rollback(function() {
						err.msg = "error inserting meal contents , transaction rolledback";
						err.statusCode = 500;
						reject( err )
					});
					return;	
				}
				console.log( secondResult );  
				connection.commit(function(err) {
				if (err) { 
					connection.rollback(function() {
					
						err.msg = "error commiting the transaction in insertMeal contents , transaction rolledback";
						err.statusCode = 500;
						reject( err );
					});
					return ;
				}else{
					console.log('Transaction Complete.');							
					resolve( "inserted" );
				}
				
				});
			});


		});

		});
	});
}

function preapareContentsInsertionSql(  mealId ,  contents ){
	
	var ids = []; 
	var sql = "INSERT INTO contents(id , mealId, name , createdAt, updatedAt) VALUES  ";
	for( var i = 0 ; i<contents.length ; i++ ){
		ids.push( mealId );
		ids.push( contents[i].name );
		
		sql = sql + `( NULL , ? , ? ,CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )`;
		if( i != (contents.length-1) ){
			sql = sql +" , ";
		}
	}
	return [ sql , ids ];
}


/*
		connection.query ( sql , preparedData , function( err , data ){
			if( err ){
				err.msg = "could not get insert meal";
				err.statusCode = 500;
				reject( err );
			}else{
				resolve( data );
			}
		});
*/
function insertContent(  contentName ){
	
	return new Promise(
		function( resolve , reject ){
			connection.query("INSERT IGNORE INTO  `contents`(`id`, `name`, `createdAt`, `updatedAt`) VALUES ( NULL , ? , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP ) " , contentName , function( err , data ){
				if( err ){
					
					err.statusCode = 500;
					err.msg = "could not insert content into DB"
					reject( err );
				}else{
					resolve( data );
				}
			});
		}
	);
}


function getMealContents(  mealId ){
	
	return new Promise(
		function( resolve , reject ){
			connection.query("select * from meal_content mc JOIN contents c on mc.contentId = c.id where mc.mealId = ?  " , mealId , function( err , data ){
				if( err ){
					err.statusCode = 500;
					err.msg = "could not get meal contents data from DB"
					reject( err );
				}else{
					resolve( data );
				}
			});
		}
	);
}

function isValidMeal( meal ){
	if( meal.categoryId == null || meal.categoryId == undefined ||  isNaN(meal.categoryId ) )
	return "meal categoryId value not found";
	if( meal.name == null || meal.name == undefined || meal.name == "" )
	return "meal name value is not found";
	if( meal.desc == null || meal.desc == undefined ||  meal.desc == "" )
	return "meal description value not found";
	if( meal.rate == null || meal.rate == undefined ||  isNaN(meal.rate ) )
	return "meal rate value is not found";
	if( meal.price == null || meal.price == undefined ||  isNaN(meal.price ) )
	return "meal price value is not found";
	if( meal.picture == undefined || meal.picture == null || meal.picture == "")
	return "meal picture not found";

	return true;

}


module.exports = {
 getMealsByCategory ,
 insertMeal ,
 getOffers ,
 getOffersByLimits ,
 isValidMeal ,
 getMealById ,
 insertContent ,
 getMealContents,
 getMeals
};