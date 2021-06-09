const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11418105',
  password: 'hIMNsekdWx',
  database: 'sql11418105',
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;