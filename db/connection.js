// mysql2 import
const mysql = require('mysql2');

// connection to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '20702070',
        database: 'employees'
    },
    console.log(`CONNECTED TO EMPLOYEE DATABASE`)
);

module.exports = db;
