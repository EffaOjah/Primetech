require('dotenv').config();
const jwt = require('jsonwebtoken');

// Require sql connection
const connection = require('../db/db');

// Function to return the number of users
// async function getNumberOfUsers(){
//     return new Promise((resolve, reject) => {
//         connection.query('SELECT COUNT(*) AS rowCount FROM users', (err, result)=>{
//             if ((err)) {
//                 console.log(err);
//                 reject(err);
//             } else{
//                 console.log('Number of users:', result[0].rowCount);
//                 resolve(result[0].rowCount);
//             }
//         })
//     })
// }
  
  const secretKey = process.env.SECRET;
  
  // Fucntion to genarate the JWT
  async function generateJwt(username) {
    return new Promise((resolve, reject) => {
        const payload = {
            username: username
          };

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log('Generated JWT:', token);
        
        resolve(token);
    })
  }

  // Function to set the cookie
  async function setCookie(res, token) {
    res.cookie('jwt', token);
    console.log('successfully set cookie');
    return token;
  }

  // Function to set the cookie
  async function setAdminCookie(res, token) {
    res.cookie('adminJwt', token);
    console.log('successfully set cookie');
    return token;
  }


  // Middleware to verify JWT and restrict access based on role
const restrictToRole = (role) => {
    return (req, res, next) => {
        // Check if the user role matches the required role
        if (req.user && req.user.role === role) {
            // User has the required role, allow access to the route
            next();
        } else {
            // User does not have the required role, deny access
            return res.status(403).json({ error: 'Forbidden' });
        }
    };
};

  module.exports = {generateJwt, setCookie, setAdminCookie, restrictToRole};