const express = require('express');

const router = express.Router();

const md5 = require('md5');

// Require multer for file upload
const multer = require('multer');

const upload = multer({
    dest: 'public/uploads/profilePics',
    fileFilter: (req, file, cb) => {
    //   // Check if the uploaded file is an image
    //   if (!file.mimetype.startsWith('image/')) {
    //     // return cb(new Error('Only image files are allowed!'), false);
    //     return console.log('Only image files are allowed!');
    //     // ({error: 'Only image files are allowed!'});
    //   }
      cb(null, true);
    }
  });


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

// Route for vendor file upload
router.post('/upload-pic', upload.single('image'), verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // Get the vendor's active coupon codes
    const getActiveCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 0);

    // Get the vendor's used coupon codes
    const getUsedCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 1);

     // Check if file was uploaded
     if (!req.file) {
        console.log('Please provide an image');

        return res.render('Vendors Dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons, alertMessage: 'Please provide an image', alertColor: 'red'});
    }

    // Ensure the file uploaded is of type: image
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        return res.render('Vendors Dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons, alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }
    console.log('File uploaded successfully: ', req.file);

    // If file upload was successful, update the database
    connection.query('UPDATE users SET display_image = ? WHERE user_id = ?', [req.file.filename, fetchUserByUsername[0].user_id], (err)=>{
        if (err) {
            console.log('Error updating the display_image column of the user: ', err);

            return res.render('Vendors Dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons, alertMessage: 'An error occured!', alertColor: 'red'});
        } else{
            console.log('Successfully updated the display_image column of the user');

            return res.render('Vendors Dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons, alertMessage: 'Successfully updated display image', alertColor: 'green'});
        }
    });
});

module.exports = router;