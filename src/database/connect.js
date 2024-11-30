require('dotenv').config();
const mysql = require('mysql2/promise');

//create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const checkConnection = async () => {
  try {
    const result = (await connection).query('select 1');
    console.log('Connect Mysql success');
  } catch (err) {
    console.log('Connect Mysql fail', err);
  }
};

checkConnection();

module.exports = connection;
