const mysql = require('mysql');

const connection = mysql.createConnection({
	host : "localhost",
	database: "food_app",
	user : "root",
	password : "",
	
  
});
/*
const connection = mysql.createConnection({
  host:  'sql11.freemysqlhosting.net',
  database:  'sql11419777', 
  user:  'sql11419777',
  password:   '1LNqGJthlX',
  
});
*/
connection.connect((err) => {
  if (err){
	console.log("cannot connect to the database");
	throw err;
  }
  console.log('Connected!');
});

module.exports = connection;