var router = require("express").Router();
const Favs = require("../models/favs");


router.get("/" , function( req , res , next ){

	var offset = req.query.offset;
	var limit = req.query.limit;
	if( offset == undefined )
	offset = 0;
	if( limit == undefined )
	limit = 5;
	offset = parseInt(offset);
	limit = parseInt(limit);
	if( offset == undefined || limit == undefined ){
		offset = 0;
		limit = 5;
	}
	var userId = req.user.id;
	Favs.getFavs( userId , offset , limit )
	.then( result =>{
		res.send( result );
	})
	.catch( next );
	return;
});

router.delete("/:mealId" , function( req , res , next ){
	console.log("aaaaaaaaaaaaaaaaaaaaaa");
	var userId = req.user.id;
	var mealId = req.params.mealId;
	if( mealId == undefined ){
		res.status( 404 ).send("mealId is not found");
		return;
	}
	userId = parseInt( userId );
	mealId = parseInt( mealId );
	Favs.deleteFav( userId , mealId )
	.then( result =>{
		if( result.affectedRows > 0){
			res.status( 204 ).send("recored has been deleted");
			return;
		}else{
			res.status( 400 ).send("recored could not be deleted");	
			return
		}
		
	})
	.catch( next );
	return;
});

router.post("/" , function( req , res , next ){
	console.log("i am at the fav screen");
	var userId = req.user.id;
	var mealId = req.body.mealId;
	if( mealId == undefined ){
		res.status( 404 ).send("mealId is not found");
		return;
	}
	userId = parseInt( userId );
	mealId = parseInt( mealId );
	Favs.insertFav( userId , mealId )
	.then( result =>{
		if( result.affectedRows > 0){
			res.status(201).send("recored has been inserted");
			return;
		}else{
			res.status( 400 ).send( "could not be inserted" );
		}
		res.send( result );
	})
	.catch( next );
	return;
});


module.exports = router;