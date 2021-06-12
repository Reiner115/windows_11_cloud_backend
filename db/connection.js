const mysql = require('mysql');
console.log(`${process.env.HOST} ${process.env.USER} ${process.env.PASSWORD} ${process.env.DATABASE}`);
const connection = mysql.createConnection({
  host:  'localhost',
  user:  'root',
  password:   '',
  database:  'food_app'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;