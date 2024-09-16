const express = require('express');

const router = express.Router();

const md5 = require('md5');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const adminFunctions = require('../Functions/adminFunctions');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Require JWT middleware
const jwt = require('../Functions/jwt');

// Require database connection
const connection = require('../db/db');

// Require multer for file upload
const multer = require('multer');

const upload = multer({
    dest: 'public/uploads/admin',
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


// GET ROUTES
// Route to get admin dashboard
router.get('/admin/dashboard', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get total no. of users
    const totalUsers = await adminFunctions.numberOfUsers();

    // Get total no. of unused coupon codes
    const unusedCouponCodes = await adminFunctions.couponCodes(false);

    // Get total no. of used coupon codes
    const usedCouponCodes = await adminFunctions.couponCodes(true);

    // Get sum of pending withdrawals
    const pendingWithdrawals = await adminFunctions.sumOfWithdrawals('PENDING');

    // Get sum of completed withdrawals
    const completedWithdrawals = await adminFunctions.sumOfWithdrawals('COMPLETED');

    res.render('Admin Dashboard', {totalUsers, unusedCouponCodes, usedCouponCodes, pendingWithdrawals, completedWithdrawals});
});

// Route to generate coupon codes
router.get('/coupon/generate', verifyToken.verifyAdminToken, async(req, res)=>{
    // Fetch * vendors
    const vendors = await adminFunctions.allVendors();

    res.render('Generate Coupons', {vendors});
})

// Route to get all coupon codes
router.get('/coupon-codes', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all coupon codes
    const allCouponCodes = await adminFunctions.allCouponCodes();

    res.render('Admin Coupons', {allCouponCodes})
});

// Route to get all active users
router.get('/active-users', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all users
    const allUsers = await adminFunctions.allUsers();

    res.render('Active Users', {allUsers})
});

// Route to get all vendors
router.get('/all-vendors', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all users
    const allVendors = await adminFunctions.allVendors();

    res.render('Active Vendors', {allVendors})
});

// Route to get all pending affiliate withdrawals
router.get('/pending-affiliate-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const pendingWithdrawals = await adminFunctions.withdrawals('Affiliate Withdrawal', 'PENDING');

    res.render('Pending Affiliate Withdrawals', {pendingWithdrawals});
});

// Route to get all pending non affiliate withdrawals
router.get('/pending-earnings-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const pendingWithdrawals = await adminFunctions.withdrawals('Non Affiliate Withdrawal', 'PENDING');

    res.render('Pending Earnings Withdrawals', {pendingWithdrawals});
});

// Route to get all approved withdrawals
router.get('/approved-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const approvedWithdrawals = await adminFunctions.approvedWithdrawals();

    res.render('Approved Withdrawals', {approvedWithdrawals});
});

// Route to add sponsored post
router.get('/admin/add-sponsored-post', verifyToken.verifyAdminToken, (req, res)=>{
    res.render('Select Post Type');
});

// Route to add sponsored post 1
router.get('/admin/add-sponsored-post1', verifyToken.verifyAdminToken, (req, res)=>{
    res.render('Add Post1');
});

// Route to add sponsored post 1
router.get('/admin/add-sponsored-post2', verifyToken.verifyAdminToken, (req, res)=>{
    res.render('Add Post2');
});

// Route to get all sponsored post
router.get('/admin/all-sponsored-post', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all sponsored posts
    const sponsoredPosts = await adminFunctions.sponsoredPosts();

    res.render('All Sponsored Post', {sponsoredPosts});
});

// Route to add product
// router.get('/admin/upload-product', verifyToken.verifyAdminToken, (req, res)=>{
//     res.send('Page to uplaod product');
// });

// // Route to get all products
// router.get('/admin/all-products', verifyToken.verifyAdminToken, async(req, res)=>{
//     // Get all products
//     const allProducts = await adminFunctions.allProducts();

//     res.status(200).json({
//         page: 'All products page',
//         allProducts
//     });
// });

// Route to add courses
// router.get('/admin/add-course', verifyToken.verifyAdminToken, (req, res)=>{
//     res.send('Page to add course');
// });

// // Route to get all courses
// router.get('/admin/all-courses', verifyToken.verifyAdminToken, async(req, res)=>{
//     // Get all products
//     const allCourses = await adminFunctions.allCourses();

//     res.status(200).json({
//         page: 'All courses page',
//         allCourses
//     });
// });

// Route to get users details
router.get('/user/:username', verifyToken.verifyAdminToken, async(req, res)=>{
    let username = req.params.username;
    console.log('Username: ', username);
    
    // Fetch the user's details
    const userDetails = await dashboardFunctions.fetchUserByUsername(username);

    res.render('User Detail', {userDetails});
});

// Route to send notifications to all users
router.get('/admin/send-notifications', verifyToken.verifyAdminToken, (req, res)=>{
    res.render('Notification to Verified Users')
});

// Route for website settings
router.get('/website-settings', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the notification
    const getNotification = await adminFunctions.getNotification();

    // Get settings
    const getSettings = await adminFunctions.getSettings();

    const affiliateWithdrawalSetting = getSettings[0].active_status;
    const nonAffiliateWithdrawalSetting = getSettings[1].active_status;
    const gameWithdrawalSetting = getSettings[2].active_status;

    res.render('Website Settings', {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting});
});
// Route to login as user
router.get('/admin/user/:username', verifyToken.verifyAdminToken, async(req, res)=>{
    const username = req.params.username;

    // Generate the JWT
    const generateJwt = await jwt.generateJwt(username);

    // Set the cookie
    const setCookie = await jwt.setCookie(res, generateJwt);

    res.redirect('/user/dashboard');
});


// POST ROUTES
// Route to update pop up ad
router.post('/popUpAd/update', upload.single('image'), verifyToken.verifyAdminToken, async(req, res)=>{
    const {title, link, details, button} = req.body;
    console.log('req.body: ', req.body);
    
    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        // Get the notification
        const getNotification = await adminFunctions.getNotification();

        return res.render('Website Settings', {getNotification, alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        // Get the notification
        const getNotification = await adminFunctions.getNotification();

        return res.render('Website Settings', {getNotification, alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }

    console.log('File uploaded successfully: ', req.file);

    // Update the database
    connection.query('UPDATE pop_up_ad SET notification_image = ?, notification_title = ?, notification_link = ?, notification_details = ?, button_name = ?', [req.file.filename, title, link, details, button], async(err)=>{
        if (err) {
            console.log('Error Updating Ad!: ', err);

            // Get the notification
            const getNotification = await adminFunctions.getNotification();

            return res.render('Website Settings', {getNotification, alertMessage: 'Error Updating Ad!', alertColor: 'red'});
        } else {
            // Get the notification
            const getNotification = await adminFunctions.getNotification();

            return res.render('Website Settings', {getNotification, alertMessage: 'Ad updated successfully!', alertColor: 'green'});
        }
    });
});

// Route to turn on/off withdrawal (affiliate, non_affiliate, game, zen_social)
router.post('/update-withdrawal-status', verifyToken.verifyAdminToken, (req, res)=>{
    const {withdrawalType, status} = req.body;
    console.log(req.body);
    
    // Update the status of the withdrawal
    connection.query('UPDATE withdrawalsettings SET active_status = ? WHERE setting = ?', [status, withdrawalType], (err)=>{
        if (err) {
            console.log('Error updating the active_status of the withdrawal: ', err);
            return res.status(500).json({error: `Error updating the active_status of the withdrawal: ${err}`});
        }
        console.log(`Successfully updated the active status of the ${withdrawalType} to ${status}`);
        return res.status(200).json({success: `Successfully updated the active status of the ${withdrawalType} to ${status}`});
    });
});

// Route to make user a vendor
router.post('/make-vendor', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, vlink, username} = req.body;
    console.log(req.body);
    

    connection.query('UPDATE users SET is_a_vendor = true, vendor_link = ? WHERE user_id = ?', [vlink, userId], (err, result)=>{
        if (err) {
            console.log('Error updating the vendor status of the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully updated the vendor status of the user: ', result);
            res.redirect(`/user/${username}`);        
        }
    });
});

// Route to remove user as a vendor
router.post('/remove-vendor', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_a_vendor = false WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error updating the vendor status of the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully updated the vendor status of the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to ban user
router.post('/ban-user', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_banned = true WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error banning the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully banned the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to unban user
router.post('/unban-user', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_banned = false WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error unbanning the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully unbanned the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to update user's details
router.post('/update-user-details', verifyToken.verifyAdminToken, (req, res)=>{
    const {userId, firstName, lastName, email, mobileNumber, newPassword} = req.body;
    console.log(req.body);
    
    if (!newPassword) {
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?', [firstName, lastName, email, mobileNumber, userId], (err, result)=>{
            if (err) {
                console.log(err);
                res.status(500).json({error: 'Internal server error : ', err});
            } else {
                console.log('Successfully updated the user details');
                res.status(200).json({success: 'Successfully updated the user details: ', result});
            }
        });
    } else {
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, password = ? WHERE user_id = ?', [firstName, lastName, email, mobileNumber, newPassword, userId], (err, result)=>{
            if (err) {
                console.log(err);
                res.status(500).json({error: 'Internal server error : ', err});
            } else {
                console.log('Successfully updated the user details');
                res.status(200).json({success: 'Successfully updated the user details: ', result});
            }
        });
    }
});

// Route to generate coupon code
router.post('/generate-coupon-code', verifyToken.verifyAdminToken, async(req, res)=>{
    // Fetch * vendors
    const vendors = await adminFunctions.allVendors();

    const {vendor, noOfCoupons, country} = req.body;
    console.log(req.body);

    // Check if a valid vendor was selected
    if (!vendor) {
        console.log('Please select a valid vendor');

        return res.render('Generate Coupons', {vendors, alertMessage: 'Please select a vendor', alertColor: 'red'});
    }
    
    // Check if valid country was selected
    if (!country) {
        console.log('Please select a valid country');

        return res.render('Generate Coupons', {vendors, alertMessage: 'Please select a country', alertColor: 'red'});
    }
    
    let split = vendor.split('*');
    
    var vendorDetails = {
        vendorId: split[1],
        vendorUsername: split[0]
    };

    console.log(vendorDetails);
    
    let vendorInitials = (vendorDetails.vendorUsername.slice(0, 3)).toUpperCase();
    console.log('Vendor Initials: ', vendorInitials);
    
    var arrOfGeneratedCodes = [];
    // Function to generate random coupon codes
    async function generateCouponCodes(){
        var insertData = [];
  
          for(let i = 1; i <= noOfCoupons; i++){
              // Define the length of the random part
              const randomPartLength = 16;
      
              // Generate a random string of specified length
              let randomString = Math.random().toString(36).substr(2, randomPartLength);
      
              //  Pad the random string with additional characters if its length is less than 16
              while (randomString.length < randomPartLength) {
                  randomString += Math.random().toString(36).substr(2);
              }
      
              // Take the first 16 characters to ensure length is exactly 16
              randomString = (randomString.substr(0, randomPartLength)).toUpperCase();
      
              // Concatenate the username and random string
              const couponCode = `${country}${vendorInitials}${randomString}`;
              
              arrOfGeneratedCodes.push(couponCode);
          }
          const couponCodesGenerated = arrOfGeneratedCodes;
         console.log('generatedCouponCodes :', couponCodesGenerated);

         // Push the array of generated codes and the vendorId into the insertData array
         for (let j = 0; j < couponCodesGenerated.length; j++) {
            const holder = 
              [vendorDetails.vendorId, couponCodesGenerated[j]];
    
             insertData.push(holder)
           }
           console.log(insertData);

           // Insert into the databases
           connection.beginTransaction((err) => {
            if (err) {
                console.log('Error starting transaction: ' , err);
                
                return res.render('Generate Coupons', {vendors, alertMessage: 'An error ocurred', alertColor: 'red'});
            }
        
            connection.query('INSERT INTO registeration_tokens (vendor_id, token) VALUES ?', [insertData], (err, result)=>{
                if (err) {
                    return connection.rollback(() => {
                        console.log('Error creating coupon code(Transaction rolled back): ' , err);

                        return res.render('Generate Coupons', {vendors, alertMessage: 'Operation failed', alertColor: 'red'});
                    });
                }
        
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.log('Error committing transaction: ' , err);
                            
                            return res.render('Generate Coupons', {vendors, alertMessage: 'An error ocurred', alertColor: 'red'});
                        });
                    }
        
                    console.log('Successfully created coupon code: ' + result);

                    return res.render('Generate Coupons', {vendors, alertMessage: 'Operation successful', alertColor: 'green'});
                });
            });
        });
        
      }
      
      generateCouponCodes();
});

// Route to add sponsored post 1
router.post('/add-post1', upload.single('image'), verifyToken.verifyAdminToken, (req, res)=>{
    const {postTitle, description} = req.body;
    console.log(req.body);

    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        return res.render('Add Post1', {alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        return res.render('Add Post1', {alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }

    // Insert into the database
    connection.query('UPDATE primetech_posts SET post_title = ?, post_description = ?, post_image = ? WHERE post_id = 1', [postTitle, description, req.file.filename], (err)=>{
        if (err) {
            console.log('Error adding sponsored post 1: ', err);
            return res.render('Add Post1', {alertMessage: 'Error adding sponsored post 1', alertColor: 'red'});
        } else{
            console.log('Successfully added sponsored post 1');
            return res.render('Add Post1', {alertMessage: 'Successfully added sponsored post 1', alertColor: 'green'});
        }
    });
});

// Route to add sponsored post 1
router.post('/add-post2', upload.single('image'), verifyToken.verifyAdminToken, (req, res)=>{
    const {postTitle, contactLink, description} = req.body;
    console.log(req.body);

    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        return res.render('Add Post2', {alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        return res.render('Add Post2', {alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }

    // Insert into the database
    connection.query('UPDATE primetech_posts SET post_title = ?, contact_link = ?, post_description = ?, post_image = ? WHERE post_id = 2', [postTitle, contactLink, description, req.file.filename], (err)=>{
        if (err) {
            console.log('Error adding sponsored post 2: ', err);
            return res.render('Add Post2', {alertMessage: 'Error adding sponsored post 2', alertColor: 'red'});
        } else{
            console.log('Successfully added sponsored post 2');
            return res.render('Add Post2', {alertMessage: 'Successfully added sponsored post 2', alertColor: 'green'});
        }
    });
});

// Route to approve withdrawal
router.get('/withdrawal/approve/:id', (req, res)=>{
    let withdrawalId = req.params.id;
    console.log('Withdarwal Id: ', withdrawalId);
    
    // Use id to fetch withdrawal details
    
});

module.exports = router;