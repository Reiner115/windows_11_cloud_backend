const mysql = require('mysql');
console.log(`${process.env.HOST} ${process.env.USER} ${process.env.PASSWORD} ${process.env.DATABASE}`);
const connection = mysql.createConnection({
  host:  'sql11.freemysqlhosting.net',
  database:  'sql11419777', 
  user:  'sql11419777',
  password:   '1LNqGJthlX',
  
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;