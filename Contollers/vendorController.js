const express = require('express');

const router = express.Router();

const md5 = require('md5');

// Require the functions middleware
const functions = require('../Functions/functions');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');

// Route for vendor dashboard
router.get('/vendor/dashboard', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // Get the vendor's active coupon codes
    const getActiveCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 0);

    // Get the vendor's used coupon codes
    const getUsedCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 1);
    res.render('Vendors Dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons});
});

module.exports = router;