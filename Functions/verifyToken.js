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
const verifyPostToken = (req, res, next) =>{
    const token = req.cookies.jwt;

    if (!token){
        console.log('Token is not provided');
        return 'Hellp';
    }

    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log('Invalid token');
            next();
        }

        next();
    });
};
module.exports = {verifyToken, verifyAdminToken, verifyPostToken};