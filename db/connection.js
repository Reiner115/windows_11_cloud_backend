const mysql = require('mysql');
console.log(`${process.env.HOST} ${process.env.USER} ${process.env.PASSWORD} ${process.env.DATABASE}`);
const connection = mysql.createConnection({
  host:  'sql11.freemysqlhosting.net',
  user:  'sql11418105',
  password:   'hIMNsekdWx',
  database:  'sql11418105'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;