require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) =>{
    const token = req.cookies.jwt;

    if (!token){
        console.log('Token is not provided');
        return res.redirect('/user/login');
    }

    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log('Invalid token');
            return res.redirect('/user/login');
        }

        req.user = decoded;
        console.log(decoded);
        next();
    });
};

// Middleware to verify JWT token
const verifyAdminToken = (req, res, next) =>{
    const token = req.cookies.adminJwt;

    if (!token){
        console.log('Token is not provided');
        return res.redirect('/primetech-admin/login');
    }

    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log('Invalid token');
            return res.redirect('/primetech-admin/login');
        }

        next();
    });
};


// Middleware to verify JWT token for post
const verifyPostToken = (req, res, next) => {
    const token = req.cookies.jwt; // Check for token in cookies

    if (!token) {
        console.log('Token is not provided');
        req.user = null;  // Setting req.user to null for unauthenticated users
        return next();  // Proceed to the next middleware/route handler
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('Invalid token');
            req.user = null;  // If token is invalid, treat as unauthenticated
            return next();  // Proceed without throwing an error
        }

        // Valid token
        req.user = decoded;  // Attach decoded user information to the request
        console.log('Decoded JWT:', decoded);
        next();  // Proceed to the next middleware/route handler
    });
};
module.exports = {verifyToken, verifyAdminToken, verifyPostToken};