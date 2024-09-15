// const mysql = require('mysql');

// // Setup MySQL connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'isonyefo_primetech-user',
//     password: 'admin@primetech.com',
//     database: 'isonyefo_primetechdb',
//   });

// module.exports = connection;


const mysql = require('mysql');

// Setup MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'primetechdb',
  });

module.exports = connection;