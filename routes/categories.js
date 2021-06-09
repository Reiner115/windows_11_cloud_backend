var express = require('express');
var routes = express.Router();
var Category = require("../models/category.js");
const fs = require("fs");
const path = require("path");
const imagesPath = "public/images/";

routes.get('/', function(req , res , next ){
	console.log("a request has been recived");
	Category.getAllCategorys().
	then( data =>{
		res.send( data );
	}).
	catch( next );
});
var upload  = require("../multer");



routes.post('/',  upload.single('image') , function(req , res , next ){


	/*
	fs.unlink( path.resolve("../public/images/"+  req.file.originalname)  , function( err ){
		if( err ){
			console.log("error deleting the file")
			console.log( err )
		}else{
			console.log("deleted")
		}
		
	});
	res.send("result");
	*/	
	
	
	var category = req.body.jsonData;
	
	if( category == undefined ){
		return res.status( 400 ).send("category information not found");
	}

	category = JSON.parse( category );

	category.picture = req.fileName;
	console.log( req.fileName );
	console.log( category );
	if( category.picture == undefined ){
		 res.status( 400 ).send("picture not found");
		 return
	}
	if( category.name == undefined ){
		return res.status( 400 ).send("category name not found");
	}

	if( category.desc == undefined ){
		return res.status( 400 ).send("category description not found");
	}


	

	Category.insertCategory( category ).
	then( data =>{
		res.send( data );
	}).catch( next );
});

 
module.exports = routes;