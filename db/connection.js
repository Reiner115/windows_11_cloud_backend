const mysql = require('mysql');

const connection = mysql.createConnection({
	host : "remotemysql.com",
	database: "xPkDqzlTWC",
	user : "xPkDqzlTWC",
	password : "Fof2WrIFpd",
	
  
});

connection.connect((err) => {
  if (err){
	console.log("cannot connect to the database");
	throw err;
  }
  console.log('Connected!');
});

module.exports = connection;