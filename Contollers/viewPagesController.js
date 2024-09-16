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
    connection.query('SELECT * FROM registeration_tokens WHERE token = ?', coupon, (err, result)=>{
        if (err) {
            console.log(err);
            
        } else{
            console.log('Coupon Info: ', result);

            // Get the username of the user with inner join
            connection.query('SELECT * FROM users INNER JOIN registeration_tokens ON users.user_id = registeration_tokens.user_id WHERE token = ?', coupon, (err, info)=>{
                if (err) {
                    console.log(err);
                } else{
                    console.log(info);
                    res.render('Verify Coupon Result', {coupon: result, info});
                }
            });
        }
    });
});

// Top earners route
router.get('/top-earners', (req, res)=>{
    // Get the top earners
    connection.query('SELECT u.username, t.user_id, SUM(t.amount) AS balance FROM affiliate_transactions t JOIN users u ON t.user_id = u.user_id GROUP BY t.user_id, u.username ORDER BY balance DESC', (err, result)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('Result: ', result);
            res.render('Top Earners', {earners: result});
        }
    });
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