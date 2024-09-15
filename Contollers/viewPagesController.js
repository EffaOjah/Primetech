const express = require('express');

const router = express.Router();

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