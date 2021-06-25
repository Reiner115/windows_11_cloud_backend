const mysql = require('mysql');

const connection = mysql.createConnection({
	host : "db4free.net",
	database: "food_app",
	user : "mohamed_food_app",
	password : "199765432",
	
  
});

connection.connect((err) => {
  if (err){
	console.log("cannot connect to the database");
	throw err;
  }
  console.log('Connected!');
});

module.exports = connection;