const mysql = require('mysql');

const connection = mysql.createConnection({
	host:  'sql11.freemysqlhosting.net',
	database:  'sql11419777', 
	user:  'sql11419777',
	password:   '1LNqGJthlX',
	
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
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;