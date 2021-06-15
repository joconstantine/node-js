const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: process.env.NODE_DB_PASSWORD,
});

module.exports = pool.promise();