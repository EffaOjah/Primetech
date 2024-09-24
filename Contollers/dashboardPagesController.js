require('dotenv').config();
const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const md5 = require('md5');

const secret = process.env.SECRET;

// Require the functions middleware
const functions = require('../Functions/functions');

const checkUser = require('../Functions/validate');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');

// Set router to use the verify token middleware
// router.use(verifyToken.verifyToken);

// GET ROUTES
// Route to get user balances
router.get('/loadBalances', verifyToken.verifyToken, async(req, res)=>{
    try {
       // Fetch user details using username
       const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username); 

       // Create the user's affiliate balance view
       const createAffiliateBalanceView = await dashboardFunctions.createAffiliateBalanceView(fetchUserByUsername[0].user_id);

       // Get the user's total affiliate balance view
       const getTotalAffiliateBalanceView = await dashboardFunctions.getTotalAffiliateBalanceView();

       // Get the user's total direct referral balance
       const getTotalDirectReferralBalance = await dashboardFunctions.getTotalReferralBalanceView('Direct Referral');

       // Get the user's total indirect referral balance
       const getTotalIndirectReferralBalance = await dashboardFunctions.getTotalReferralBalanceView('InDirect Referral');

       // Create the user's non affiliate balance view
       const createNonAffiliateBalanceView = await dashboardFunctions.createNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

       // Get the user's total non affiliate balance view
       const getTotalNonAffiliateBalanceView = await dashboardFunctions.getTotalNonAffiliateBalanceView();

       // Create the user's game balance view
       const createGameBalanceView = await dashboardFunctions.createGameBalanceView(fetchUserByUsername[0].user_id);

       // Get the user's total game balance view
       const getTotalGameBalanceView = await dashboardFunctions.getTotalGameBalanceView();

       res.status(200).json({getTotalAffiliateBalanceView, getTotalDirectReferralBalance, getTotalIndirectReferralBalance, getTotalNonAffiliateBalanceView, getTotalGameBalanceView})
    } catch (error) {
        console.log('Error: ', error);
        res.status(404).json(error);
    }
});

// User dashboard route
router.get('/user/dashboard', verifyToken.verifyToken, async(req, res)=>{
    console.log('req.user: ', req.user);

    try {
       // Fetch user details using username
       const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

       //Get the user's referrals
       const getReferrals = await dashboardFunctions.getReferrals(fetchUserByUsername[0].referral_code);

       // Get the user's total withdrawal
       const getTotalWithdrawal = await dashboardFunctions.getTotalWithdrawal(fetchUserByUsername[0].user_id);

       console.log('Users details: ', fetchUserByUsername, getReferrals, getTotalWithdrawal);
       
       res.render('Dashboard', {user: fetchUserByUsername[0], referrals: getReferrals[0].referrals, totalWithdrawal: getTotalWithdrawal[0].totalWithdrawal});

    } catch (error) {
        console.log(error);
    }
});

// Update profile route
router.get('/update/profile', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('Update Profile', {user: fetchUserByUsername[0]});
});

// Route to place withdrawal
router.get('/place-withdrawal', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // Get withdrawal settings
    const getWithdrawalSettings = await dashboardFunctions.getSettings();

    res.render('Submit Withdrawal', {user: fetchUserByUsername[0], settings: getWithdrawalSettings});
});

// Route to update bank details
router.get('/update/bank-details', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('Update Bank Details', {user: fetchUserByUsername[0]}); 
});

// Route to update pin
router.get('/update/pin', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('Set pin', {user: fetchUserByUsername[0]});
});

// Route for withdrawal history
router.get('/history/withdrawals', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // Get the user's withdrawal history
    connection.query('SELECT * FROM withdrawals WHERE user_id = ?', fetchUserByUsername[0].user_id, (err, withdrawals)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('withdrawals: ', withdrawals);

            res.render('Withdrawals history', {user: fetchUserByUsername[0], withdrawals});
        }
    });
});

// Route for VTU history
router.get('/history/VTU', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('VTU History', {user: fetchUserByUsername[0]});
});

// Route for P2P registration
router.get('/registration/p2p', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('P2P Registration', {user: fetchUserByUsername[0]});
});

// Route to upload product
router.get('/product/upload', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('Upload Product', {user: fetchUserByUsername[0]});
});

// Route for downlines
router.get('/downlines', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // get the user's downlines
    connection.query('SELECT username FROM users WHERE referrer = ?', fetchUserByUsername[0].referral_code, (err, downlines)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('Downlines: ', downlines);
            res.render('Downlines', {user: fetchUserByUsername[0], downlines});
        }
    });
});

// Route for game
router.get('/game', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    // Create the user's non affiliate balance view
    const createNonAffiliateBalanceView = await dashboardFunctions.createNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

    // Get the user's total non affiliate balance view
    const getTotalNonAffiliateBalanceView = await dashboardFunctions.getTotalNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

    res.render('game', {user: fetchUserByUsername[0], nonAffiliateBalance: getTotalNonAffiliateBalanceView[0].nonAffiliateBalance});
});

// Route for posts
router.get('/sponsored-posts', async(req, res)=>{
    // Get all posts
    const getSinglePost = await dashboardFunctions.getSinglePost(2);

    res.render('Sponsored Post', {getSinglePost});
});

// Route for tiktok pay
router.get('/tiktok', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
    console.log('user: ', fetchUserByUsername[0]);

    res.render('Tiktok pay', {user: fetchUserByUsername[0]});
});

// Route for posts
router.get('/advert-posts', async(req, res)=>{
    // Get all posts
    const getSinglePost = await dashboardFunctions.getSinglePost(1);

    res.render('Advert Posts', {getSinglePost});
});

// Route for post detail
router.get('/post/:id', async(req, res)=>{
    let postId = req.params.id;

    // Get post with id
    const post = await dashboardFunctions.getSinglePost(postId);

    res.render('Post Detail', {post});
});

// Route to share post
router.get('/share-post', verifyToken.verifyPostToken, async(req, res)=>{
    if (req.user) {
        console.log('User is logged in');

        // Get the user's details
        const user = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Check if the user has already been rewarded for the post
        if (user[0].has_shared_post == 1) {
            console.log('User has already been credited');
        } else{
            // Update the has_joined_platform
            const updateColumn = await dashboardFunctions.updateHasSharedPostColumn(1, user[0].user_id);

            // Credit the user
            const creditUser = await dashboardFunctions.creditUserForNonAffiliate(400, 'Post 1 bonus', user[0].user_id);
        }
        
    } else{
        console.log('User is not logged in and will not be credited');   
    }
});

// Route to join platform
router.get('/join-platform', verifyToken.verifyPostToken, async(req, res)=>{
    if (req.user) {
        console.log('User is logged in');

        // Get the user's details
        const user = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Check if the user has already been rewarded for the post
        if (user[0].has_joined_platform == 1) {
            console.log('User has already been credited');
        } else{
            // Update the has_joined_platform
            const updateColumn = await dashboardFunctions.updateHasSharedPostColumn(1, user[0].user_id);

            // Credit the user
            const creditUser = await dashboardFunctions.creditUserForNonAffiliate(300, 'Post 2 bonus', user[0].user_id);
        }
        
    } else{
        console.log('User is not logged in and will not be credited');   
    }
});


// POST ROUTES
// POST route to update bank details
router.post('/update-bank-details', verifyToken.verifyToken, async(req, res)=>{
    console.log(req.body);

    const {userId, bank, accountName, accountNumber} = req.body;

    let split = bank.split('-');
   
    const bankDetails = {
        bankName: split[0],
        bankCode: split[1]
    };

    console.log(bankDetails);
    
    // update bank details
    connection.query('UPDATE users SET account_number = ?, account_name = ?, bank_name = ?, bank_code = ? WHERE user_id = ?', [accountNumber, accountName, bankDetails.bankName, bankDetails.bankCode, userId], async(err)=>{
        if (err) {
            console.log(err);
            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
            res.render('Update Bank Details', {user: fetchUserByUsername[0], alertMessage: 'error updating bank details', alertColor: 'red'});
        } else{
            console.log('Successfully updated bank details');
            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
            res.render('Update Bank Details', {user: fetchUserByUsername[0], alertMessage: 'successfully updated bank details', alertColor: 'green'});
        }
    })
});

// POST route to update user profile
router.post('/update-profile', verifyToken.verifyToken, async(req, res)=>{
    const userDetails = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const {firstName, lastName, email, oldPassword, newPassword, confirmPassword} = req.body;
    console.log('req.body: ', req.body);

    // Check if all details were provided
    if (!firstName || !lastName || !email || !oldPassword || !newPassword || !confirmPassword) {
        console.log('Incomplete details');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: 'Please provide all details', alertColor: 'red'});
    }

    // Check if old password is correct
    if (md5(oldPassword) !== userDetails[0].password) {
        console.log('Incorrect password');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: 'Incorrect password', alertColor: 'red'});
    }
    
    // Check if the two new password matches
    if (newPassword !== confirmPassword) {
        console.log('New passwords dont match');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: "New passwords don't match", alertColor: 'red'});
    }

    // Check if password is 8 characters or above
    if (newPassword.length < 8) {
        console.log('Password must be 8 characters or above');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: 'Password must be 8 characters or above', alertColor: 'red'});
    }

    // Update the details
    connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE user_id = ?', [firstName, lastName, email, md5(newPassword), userDetails[0].password], async(err)=>{
        if (err) {
            console.log('Error updating user profile: ', err);
            // Get the user's details
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: 'An error ocurred', alertColor: 'red'});
        } else {
            console.log('Successfully updated user profile');
            // Get the user's details
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            return res.render('Update Profile', {user: fetchUserByUsername[0], alertMessage: "Successfully updated your profile", alertColor: 'green'});
        }
    });
});

// POST route to update user withdrawal pin
router.post('/update-pin', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const pin = req.body.withdrawalPin;

    // Check if pin is valid
    if (pin.length > 4) {
        console.log('Invalid pin format');
        return res.render('Set pin', {user: fetchUserByUsername[0], alertMessage: 'Invalid pin format', alertColor: 'red'});
    }

    // Update the details
    connection.query('UPDATE users SET withdrawal_pin = ? WHERE user_id = ?', [md5(pin), fetchUserByUsername[0].user_id], (err)=>{
        if (err) {
            console.log('Error updating pin: ', pin);
            return res.render('Set pin', {user: fetchUserByUsername[0], alertMessage: 'An error ocurred', alertColor: 'red'});
        } else {
            console.log("Successfully updated your pin");
            return res.render('Set pin', {user: fetchUserByUsername[0], alertMessage: 'Successfully updated your pin', alertColor: 'green'});
        }
    });
});

// POST route to place withdrawal
router.post('/submit-withdrawal', verifyToken.verifyToken, async(req, res)=>{
    // Get withdrawal settings
    const getWithdrawalSettings = await dashboardFunctions.getSettings();

    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const {withdrawalType, amount, pin} = req.body;
    console.log('Withdrawal details :', req.body);
    
    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Create the user's affiliate balance view
        const createAffiliateBalanceView = await dashboardFunctions.createAffiliateBalanceView(fetchUserByUsername[0].user_id);

        // Get the user's total affiliate balance view
        const getTotalAffiliateBalanceView = await dashboardFunctions.getTotalAffiliateBalanceView();

        // Create the user's non affiliate balance view
        const createNonAffiliateBalanceView = await dashboardFunctions.createNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

        // Get the user's total non affiliate balance view
        const getTotalNonAffiliateBalanceView = await dashboardFunctions.getTotalNonAffiliateBalanceView();

        // Create the user's game balance view
        const createGameBalanceView = await dashboardFunctions.createGameBalanceView(fetchUserByUsername[0].user_id);

        // Get the user's total game balance view
        const getTotalGameBalanceView = await dashboardFunctions.getTotalGameBalanceView();


        // Check if user has updated his/her bank details
        if (!fetchUserByUsername[0].account_number || !fetchUserByUsername[0].account_name || !fetchUserByUsername[0].bank_name || !fetchUserByUsername[0].bank_code) {
            console.log('Please update bank details');
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Please update bank details', alertColor: 'red', settings: getWithdrawalSettings});
        } 
    
        // Check if user has set pin
        if (!fetchUserByUsername[0].withdrawal_pin) {
            console.log('Please set pin');
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Please set pin', alertColor: 'red', settings: getWithdrawalSettings});
        }

        // Check withdrawal type
        if (withdrawalType == 'affiliate') {
            // Perform operations for affiliate withdrawal
            
            // Ensure that affiliate withdrawal is 8000 and above
            if ((amount * 1000) < 8000) {
                console.log('Affiliate withdrawal must be $8 or above');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Affiliate withdrawal must be $8 or above', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Check if user balance is up to 8000
            if (getTotalAffiliateBalanceView[0].affiliateBalance < 8000) {
                console.log('Your affiliate balance must be $8 or above');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Your affiliate balance must be $8 or above', alertColor: 'red', v});
            }

            // Ensure that withdrawal affiliate amount is not more than user's balance
            if ((amount * 1000) > getTotalAffiliateBalanceView[0].affiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'You cannot withdraw more than your affiliate balance', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Check if pin is correct
            if(md5(pin) !== fetchUserByUsername[0].withdrawal_pin){
                console.log('Incorrect pin');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Incorrect pin', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Insert into the affiliate transactions table
            const insertIntoAffiliateTransactions = await dashboardFunctions.insertIntoAffiliateTransactions(`${-(amount * 1000)}`, 'Affiliate Withdrawal', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1000), 'Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of $${amount}`);
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: `Successfully placed withdrawal of $${amount}`, alertColor: 'green'});
        } else if (withdrawalType == 'earnings') {
            // Perform operations for earnings withdrawal

            // Ensure that earnings withdrawal is 30000 and above
            if ((amount * 1000) < 30000) {
                console.log('Earnings withdrawal must be $30 or above');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Earnings withdrawal must be $30 or above', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Check if user balance is up to 30000
            if (getTotalNonAffiliateBalanceView[0].nonAffiliateBalance < 30000) {
                console.log('Your earnings balance must be 30000 or above');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Your earnings balance must be 30000 or above', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Ensure that earnings affiliate amount is not more than user's balance
            if ((amount * 1000) > getTotalNonAffiliateBalanceView[0].nonAffiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'You cannot withdraw more than your affiliate balance', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Check if pin is correct
            if(md5(pin) !== fetchUserByUsername[0].withdrawal_pin){
                console.log('Incorrect pin');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Incorrect pin', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Insert into the affiliate transactions table
            const insertIntoNonAffiliateTransactions = await dashboardFunctions.insertIntoNonAffiliateTransactions(`${-(amount)}`, 'Non Affiliate Withdrawal', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1000), 'Non Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of ${amount}ZP`);
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: `Successfully placed withdrawal of ${amount}ZP`, alertColor: 'green', settings: getWithdrawalSettings});
        } else if (withdrawalType == 'game') {
            // Perform operations for games withdrawal

            // Ensure that games withdrawal is not more than the user's balance
            if ((amount * 1000) > getTotalGameBalanceView[0].gameBalance) {
                console.log('Insufficient game balance');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Insufficient game balance', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Check if pin is correct
            if(md5(pin) !== fetchUserByUsername[0].withdrawal_pin){
                console.log('Incorrect pin');
                return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Incorrect pin', alertColor: 'red', settings: getWithdrawalSettings});
            }

            // Insert into the affiliate transactions table
            const insertIntoGameTransactions = await dashboardFunctions.insertIntoGameTransactions(fetchUserByUsername[0].user_id, `${-(amount)}`);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1000), 'Game Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of $${amount / 1000}`);
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: `Successfully placed withdrawal of $${amount / 1000}`, alertColor: 'green', settings: getWithdrawalSettings});
        }
        else{
            console.log('Invalid Withdrawal type');
            return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Invalid Withdrawal type', alertColor: 'red', settings: getWithdrawalSettings});
        }
    } catch (error) {
        console.log('Internal server error: ', error);
        return res.render('Submit Withdrawal', {user: fetchUserByUsername[0], alertMessage: 'Internal server error', alertColor: 'red', settings: getWithdrawalSettings});
    }
});

// POST route for P2P registration
router.post('/p2p', verifyToken.verifyToken, async (req, res)=>{
    const {firstName, lastName, username, phoneNo, email, country, password, passwordConfirmation} = req.body;
    console.log('req.body: ', req.body);

    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Create the user's non affiliate balance view
    const createNonAffiliateBalanceView = await dashboardFunctions.createNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

    // Get the user's total non affiliate balance view
    const getTotalNonAffiliateBalanceView = await dashboardFunctions.getTotalNonAffiliateBalanceView();

    try {
        // First Make sure there is no empty field
        if(!firstName || !lastName || !username || !phoneNo || !email || !country || !password || !passwordConfirmation){
        console.log('Please provide all fields');
        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Please provide all fields', alertColor: 'red'});
        }
    
        // check the user's balance
        if (getTotalNonAffiliateBalanceView[0].nonAffiliateBalance < 5000) {
            console.log('Insufficient Account Balance');
            return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Insufficient Account Balance', alertColor: 'red'});
        }
    
        // Check password length
        if (password.length < 8) {
            console.log('Password must be 8 characters or more');
            return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Password must be 8 characters or more', alertColor: 'red'});
        }
    
        // Check if passwords match
        if (password !== passwordConfirmation) {
        console.log('Passwords do not match');
        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Passwords do not match', alertColor: 'red'});
        }
    
    
        // Now check if username already exist
        const checkTheUsername = await functions.checkUsername(username);
        if (checkTheUsername.length > 0) {
        console.log('Username has already been used');
        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Username has already been used', alertColor: 'red'});
        }
    
        
        // Check if email is valid
        if (!functions.validateEmail(email)) {
            console.log('Please insert valid email');
            return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Please insert valid email', alertColor: 'red'});
        }
    
        // Now check if username already exist
        const checkTheEmail = await functions.checkEmail(email);
        if (checkTheEmail.length > 0) {
        console.log('Email has already been used');
        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Email has already been used', alertColor: 'red'});
        }
    
        console.log('Validation passed');
    
    
        // Now create the user
        const createTheUser = await functions.createUserp2P(firstName, lastName, username, phoneNo, email, password, functions.generateReferralCode(username), fetchUserByUsername[0].referral_code)
    
        const newUserId = createTheUser.insertId;
        console.log(newUserId);
        
        // After registering the new person, debit the user
        const debitTheUser = await functions.debitUser(fetchUserByUsername[0].user_id);
    
        // Then credit the newly registered user the welcome bonus
        const creditNewUser = await functions.creditNewUser(newUserId);
        console.log(creditNewUser);


        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Successfully created the user', alertColor: 'green'});
        } catch (error) {
        console.log('Internal Server Error: ', error);
        return res.render('P2P Registration', {user: fetchUserByUsername[0], alertMessage: 'Internal Server Error', alertColor: 'red'});
        }
});

// POST route to credit game balance
router.post('/credit-game-balance', async(req, res)=>{
    const token = req.cookies.jwt;

    // Check if the user is logged in
    if (!token){
        console.log('Token is not provided');
        return res.status(200).json({notLoggedIn: 'Token is not provided'});
    }

    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log('Invalid token');
            return res.status(200).json({notLoggedIn: 'Token is not provided'});
        }

        req.user = decoded;
        console.log(decoded);
    });

    
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const {userId, amount} = req.body;
    console.log('req.body: ', req.body);

   try {
     // Get the user's total non affiliate balance view
     const getTotalNonAffiliateBalanceView = await dashboardFunctions.getTotalNonAffiliateBalanceView(fetchUserByUsername[0].user_id);

     // Check if the user has already played game
    if (fetchUserByUsername[0].has_played_game == 1) {
        console.log('You have already played the game');
        return res.status(200).json({played: 'You have already played the game'});   
    }

    // Check if the user is eligible to play the game
    if (getTotalNonAffiliateBalanceView[0].nonAffiliateBalance < 20000) {
        console.log('You are not eligible to play this game');
        return res.status(200).json({notEligible: 'You are not eligible to play this game'});   
    }

    try {
        // Update the user's game balance
        const insertIntoGameTransactions = await dashboardFunctions.insertIntoGameTransactions(userId, amount);

        // Update the has_played_game column
        const updateGameColumn = await dashboardFunctions.updateGameColumn(userId, 1);

        res.status(200).json({message: 'Successfully credited user'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error});
    }

   } catch (error) {
    console.log(error);
    
    res.status(500).json({error: error});
   }
});

// POST route to update the tiktok details
router.post('/tiktok', verifyToken.verifyPostToken, async(req, res)=>{
     // Get the user's details
     const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const {fullName, username, profileLink} = req.body;

    connection.query('UPDATE users SET tiktok_full_name = ?, tiktok_username = ?, tiktok_profile_link = ? WHERE user_id = ?', [fullName, username, profileLink, fetchUserByUsername[0].user_id], (err)=>{
        if (err) {
            console.log(err);
            res.render('Tiktok pay', {user: fetchUserByUsername[0], alertMessage: 'Internal Server Error', alertColor: 'red'});
        } else{
            console.log('Successfully inserted into the database');
            res.render('Tiktok pay', {user: fetchUserByUsername[0], alertMessage: 'Success', alertColor: 'green'});
        }
    })
})
module.exports = router;