var express = require("express");
var app = express();

var myLogger = function (err , req, res, next) {
		
		console.log(" code : " + err.statusCode);
		console.log( " msg : " + err.mesg);
		console.log( "message : " + err.message);
		res.status( err.statusCode ).send( err );
		next();
	
  } 

app.use("/e15/precheck" , function(req , res , next){

	console.log(req.body);
	console.log(req.headers,"\n\n\n\n\n\n\n\n");

	const response = {
		response_code:200,
		//additonal fields
		total_amount: 100,
		status: 1,
		amount_due: 111,
		currency_code: "SDG",
		expiry: "2020-01-01",
		payer_name: "EBS",
		ref_id: 5555,
		unit_name: "سداد"
	
	};
	res.json(response).status(200).send();

});

app.use("/e15/provision" , function(req , res , next){

	console.log(req.body);
	console.log(req.headers,"\n\n\n\n\n\n\n");

	const response = {
		response_code:200,
		response_message : "is this message gonna be displayed?",
		verifier: "e400d79960d7518286354954e537e1f43e12d93ea8ffc9c1dcceea090438ccee",
		uuid: "uuid",
		ref_id: 5555,
		amount_due: 100,

	
	};
	res.json(response).status(200).send();

});
//no authrization needed to access these routes

app.use( "/user" , require("./userRoute") );
app.use("/public" , require("./accessFile"));
//app.use("/" , (req,res)=> {return res.status(500).json({responseMessage : "SOME ERROR 123"}).send()});

//authenticate user
app.use("/" , require("./authenticate"))
//authenticated users only acess these pathes
app.use( "/upload" , require("./upload") );
app.use( "/state" , require("./stateRoute") );
app.use("/actions" , require("./actions"));

app.use( "/" , (req , res , next)=>res.status(200).send("you have requested wrong page"));
app.use(myLogger)

module.exports = app;