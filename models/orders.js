const connection = require("../db/connection");

async function getOrderById( userId , orderId  ){
	return new Promise(
		function( resolve , reject ){
			console.log(`user id is ${userId} order id is ${orderId}`);
			connection.query(
				 "SELECT status , paidPrice  , orders.createdAt , orders.updatedAt ,"+
				 " SUM(meal_order.quantity * meal_order.price ) as totalPrice FROM orders"+
			" JOIN meal_order on orders.id = meal_order.orderId WHERE userId = ? and orders.id = ? limit 1"
			 , [ userId , orderId  ] ,
			  function( err  ,  orderData ){
				if( err ){
					err.statusCode = 500;
					err.msg = "colud not get order from db"
					reject( err );
					return;
				}else{
					var myOrder = orderData[0];
					console.log( myOrder );
					if( myOrder == undefined ){
						console.log("instance of aaaaaaaaaaaaaaaaaaaa");
						resolve( orderData );
						return;
					}
					connection.query(
						"SELECT meals.id, meals.name , meals.desc , meals.picture, meal_order.price , meals.rate, meals.offer, meal_order.quantity , meal_order.createdAt , meal_order.updatedAt FROM meals JOIN meal_order on meals.id = meal_order.mealId where meal_order.orderId = ?",
					orderId,
					function( err , meals ){
						if( err ){
							err.statusCode = 500;
							err.msg = "colud not get order meals from db"
							reject( err );
						}
						myOrder.meals = meals;
						resolve( myOrder );
					}	
					);
				}
			});
		});
}



async function getOrders( userId , offset , limit  ){

	return new Promise(
		function( resolve , reject ){
			connection.query("select orders.id , orders.status , orders.paidPrice , orders.createdAt , orders.updatedAt  , SUM( meal_order.quantity * meal_order.price ) as totalPrice from orders join meal_order on orders.id = meal_order.orderId where userId = ?  GROUP BY orders.id  ORDER BY orders.createdAt DESC limit ? , ? " , 
			[ userId , offset , limit ] ,
			 function( err , data ){
				if( err ){
					err.statusCode = 500;
					err.msg = "could not get orders";
					reject( err );
					return;
				}
				resolve( data );

			});
			
		});
}


async function insertOrder( order ){
	return new Promise(
		function( resolve , reject ){
						/* Begin transaction */
						
			connection.beginTransaction(function(err) {
				if (err) { 
					//throw err;
					err.msg = "error begining transaction in insertOrder";
					err.statusCode = 500;
					reject( err )
					return;
				 }
				 
				var preaparedOrderArray = [];
				preaparedOrderArray.push( order.userId );
				preaparedOrderArray.push( order.paidPrice );
				
				connection.query("INSERT INTO `orders`"+
				"(`id`, `userId` , `paidPrice`, `status`, `createdAt`, `updatedAt`)"+
				" VALUES ( NULL , ? , ?  , 1 , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )",  
				preaparedOrderArray ,
				async function(err, result) {
					
					if (err) { 
					
						connection.rollback(function() {
							err.msg = "error inserting order in insertOrder , transaction rolledback";
							err.statusCode = 500;
							reject( err )
						});
						return
					}
					
					var orderId = result.insertId;
					var preparedResult  = peapareMealsQuery( orderId , order.meals );
					var sql = preparedResult[0];
					var data = preparedResult[1];
					connection.query( sql ,  data , function(err, result) {
						if (err) { 
							connection.rollback(function() {
								err.msg = "error inserting meals in Order , transaction rolledback";
								err.statusCode = 500;
								reject( err )
							});
							return;	
						}  
						connection.commit(function(err) {
						if (err) { 
							connection.rollback(function() {
							
								err.msg = "error commiting the transaction in insertOrder , transaction rolledback";
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
			/* End transaction */


			
		});
}


function peapareMealsQuery(  orderId ,  meals ){
	
	var ids = []; 
	var sql = "INSERT INTO `meal_order`(`mealId`, `orderId`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES ";
	for( var i = 0 ; i<meals.length ; i++ ){
		ids.push( meals[i].id );
		ids.push( orderId );
		ids.push( meals[i].quantity );
		ids.push( meals[i].price );
		
		sql = sql + `( ? , ? , ? , ? ,CURRENT_TIMESTAMP , CURRENT_TIMESTAMP )`;
		if( i != (meals.length-1) ){
			sql = sql +" , ";
		}
	}
	return [ sql , ids ];
}
/*
				preaparedOrderArray.push( order.userId );
				preaparedOrderArray.push( order.totalPrice );
				preaparedOrderArray.push( order.paidPrice );
				preaparedOrderArray.push( order.delivered );
*/
function validateOrder( order ){
	
	if( isNaN( order.userId ) || order.userId == undefined || order.userId == null  )
	return "wrong user id";
	if( order.meals == undefined  )
	return "order meals value not found in the request"
	if( !(order.meals instanceof Array )  )
	return "order meals should be in form of array of ids";

	return true;
	
}	



module.exports = {
	peapareMealsQuery ,
	insertOrder ,
	validateOrder ,
	getOrderById ,
	getOrders
};