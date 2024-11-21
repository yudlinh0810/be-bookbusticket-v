require('dotenv').config();
const mysql = require('mysql2');

//create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//check connection
connection.connect((err) => {
  if (err) {
    console.log('Connect Mysql fail', err);
    return;
  } else {
    console.log('Connect Mysql success');
  }
});

module.exports = connection;
