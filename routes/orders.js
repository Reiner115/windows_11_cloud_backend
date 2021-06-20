var router = require("express").Router();
const Order = require("../models/orders");
const con = require("../db/connection");



router.get("/:orderId" , ( req , res , next )=>{

	console.log("i am here");
	var userId = req.user.id;
	var orderId = req.params.orderId;

	orderId = parseInt(orderId);

	if( orderId == undefined ){
		res.status( 400 ).send("orderId is not found");
		return;
	}

	Order.getOrderById( userId , orderId )
	.then( result => res.send(  result ))
	.catch(next);
});

router.get("/" , ( req , res , next )=>{
	
	
	var offset = req.query.offset;
	var limit = req.query.limit;

	offset = parseInt(offset);
	limit = parseInt(limit);

	if( offset == undefined || isNaN(offset))
		offset = 0;
	
	if( limit == undefined || isNaN(limit))
		limit = 5;
		
	console.log( `offset : ${offset} ,limit : ${limit}`);
	if(  offset == undefined )
		offset = 0
	
	if( limit == undefined)
		limit = 5;
	console.log( req.user );
	var userId = req.user.id;

	Order.getOrders( userId , offset , limit )
	.then( result => res.send(  result ))
	.catch(next);
});

router.post("/" , ( req ,res ,next )=>{

	var newOrder;
	try{
	var newOrder = req.body;
	}catch( e ){
		res.status(400).send("SyntaxError: Unexpected token in JSON");
	}
	newOrder.userId = req.user.id;
	var isValidOrder = Order.validateOrder( newOrder );
	if(  isValidOrder != true ){
		res.status( 400 ).send( isValidOrder );
		return;
	}
	Order.insertOrder( newOrder ).then(result => res.send(result) ).catch( next );
});

router.delete("/:id" , ()=>{});

module.exports = router;
