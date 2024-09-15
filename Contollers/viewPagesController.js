const express = require('express');

const router = express.Router();

const connection = require('../db/db');

// Home route
router.get('/', (req, res)=>{
    res.render('Home');
});

// Buy coupon code route
router.get('/couponcode/purchase', (req, res)=>{
    res.render('Buy Coupon Code');
});

// Verify coupon code route
router.get('/couponcode/verify', (req, res)=>{
    res.render('Verify Coupon Code');
});

// Verify coupon code result
router.post('/couponcode/info', (req, res)=>{
    const coupon = req.body.coupon;

    // Check if the coupon is valid
    connection.query('SELECT * FROM users INNER JOIN registeration_tokens ON users.user_id = registeration_tokens.user_id WHERE token = ?', coupon, (err, result)=>{
        if (err) {
            console.log(err);
            
        } else{
            console.log('Coupon Info: ', result);

            res.render('Verify Coupon Result', {coupon: result});
        }
    });
});

// Top earners route
router.get('/top-earners', (req, res)=>{
    res.render('Top earners');
});

// Terms route
router.get('/terms', (req, res)=>{
    res.render('Terms');
});

// Policy route
router.get('/policy', (req, res)=>{
    res.render('Policy');
});



module.exports = router;