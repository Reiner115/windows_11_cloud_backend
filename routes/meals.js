var router = require("express").Router();
var Meal = require("../models/meal.js");

router.get("/categories/:id" ,  function(req , res , next ){
	
	var offset = req.query.offset;
	var limit = req.query.limit;
	var categoryId = req.params.id;

	categoryId

	if(  offset == undefined )
	offset = 0

	if( limit == undefined)
		limit = 5;


	console.log( ` offset  : ${offset} , limit : ${limit} `);

	if( categoryId == undefined || categoryId == undefined ||  isNaN(categoryId)  ){
		res.status( 400 ).send("categoryId value is not present");
		return;
	}

	offset = parseInt( offset );
	limit = parseInt( limit );	
	categoryId = parseInt( categoryId );

	Meal.getMealsByCategory( categoryId , offset , limit ).
	then( data =>{
		res.send( data );
	}).catch( next );

});
/*
router.get("/offer" , ( req , res)=>{
	Meal.getOffers().
	then( data =>{
		res.send( data );
	}).
	catch( err =>{
		res.send( err );
	});
});
*/
router.get("/offers/" , ( req , res , next )=>{

	console.log("i am at the offers route");
	var offset = req.query.offset;
	var limit = req.query.limit;

	if(  offset == undefined )
	offset = 0

	if( limit == undefined)
		limit = 10;

	offset = parseInt( offset );
	limit = parseInt( limit );	



	Meal.getOffersByLimits( offset , limit ).
	then( data =>{
		res.send( data );
	}).
	catch( next );
});


const upload = require("../multer");
router.post("/" , upload.single("image") ,function(req , res , next ){

	var picture = req.fileName;
	var body = req.body.jsonData;
	
	if( body != undefined )
		body = JSON.parse( body );
	

	var myMeal = {
		name : body.name ,
		desc : body.desc ,
		picture :picture,
		price : body.price,
		rate :  body.rate,
		offer : body.offer,
		categoryId : body.categoryId,
		contents : body.contents
	};
	console.log( myMeal );
	//must implement a way to make validation
	var isValidMeal = Meal.isValidMeal( myMeal );
	if( isValidMeal != true ){
		res.status( 409 ).send( isValidMeal );
		return;
	}
	Meal.insertMeal( myMeal ).
	then( data =>{
		res.send(data);
		console.log( data );
		return;
		if( data.affectedRows != undefined && data.affectedRows > 0 ){
			res.send( "Meal inserted successfully" );
			return;
		}else{
			var err = Error("could not complete request");
			err.msg = data;
			err.statusCode = 500;
			return next( err );
		}
		
	}).
	catch( next );

});


router.get("/:mealId" , function( req , res , next){
	var mealId = req.params.mealId;
	
	if(  mealId == undefined ){
		res.status( 400 ).send(" mealid not found");
		return;
	}
	if( isNaN(mealId) ){
		res.status( 400 ).send(" mealid must be a number");
		return;
	}
	var userId = req.user.id;

	Meal.getMealById( userId , mealId ).then( result => {
		res.send( result )
	}).catch(next);
});

router.get("/" , function( req , res , next){

	var offset = req.query.offset;
	var limit = req.query.limit;


	if(  offset == undefined )
		offset = 0
	
	if( limit == undefined)
		limit = 10;

	offset = parseInt( offset );
	limit = parseInt( limit );	

	Meal.getMeals( offset , limit ).then( result => {
		res.send( result )
	}).catch(next);
});



module.exports = router;
