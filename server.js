const { ENOENT } = require('constants');
const express = require('express');
const fs = require("fs");
const category  = require('./category');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var router = express.Router;
const auth = require("./Authentication/auth");

const app = express();
app.set( "view engine" , "ejs" );
const port = 3000;


app.use( express.json());
app.use( express.urlencoded());
var KEY = "MYKEY";





//app.use("/public/",express.static('public'))




//used before for serving static routes
app.get("/public/images/:imageName" ,async function(req , res){
	const exists = fs.existsSync( __dirname +  "/public/images/" + req.params.imageName );
	if( exists ){
		//res.send("ads")
		//res.sendFile(  __dirname +  "/public/images/" + req.params.imageName );
		await  new Promise(function( resolve , reject){
			setTimeout(()=> {
				//res.send("ads")
	 			res.sendFile(  __dirname +  "/public/images/" + req.params.imageName );
			},2000 )
		});
		
	}
		
	else
		res.status( 404 ).send('Not found');	
});



app.use( "/" , require("./routes") );


	app.listen(port , ()=>{ console.log('listining at port  ' + port ); });
