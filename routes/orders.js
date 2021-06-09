var router = require("express").Router();
const Order = require("../models/orders");
const con = require("../db/connection");


router.get("/:orderId" , ( req , res , next )=>{
	
	var userId = req.user.id;
	var orderId = req.params.orderId;

	if( orderId == undefined ){
		res.status( 400 ).send("orderId is not found");
		return;
	}

	Order.getOrderById( userId , orderId )
	.then( result => res.send(  result ))
	.catch(next);
});

router.get("/" , ( req , res , next )=>{
	
	var userId = req.user.id;

	Order.getOrders( userId )
	.then( result => res.send(  result ))
	.catch(next);
});

router.post("/" , ( req ,res ,next )=>{
	
	
	var newOrder = req.body;
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
