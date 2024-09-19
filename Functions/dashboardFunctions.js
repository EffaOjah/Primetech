// Require sql connection
const connection = require('../db/db');

// Function to fetch user by username
async function fetchUserByUsername(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE username = ?', username, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('fetch user details: ', result);
                resolve(result);                
            }
        })
    })
}

// Function to get user's referrals
async function getReferrals(referralCode) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(username) AS referrals FROM users WHERE referrer = ?', referralCode, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Total referrals: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get user's total withdrawal
async function getTotalWithdrawal(userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS totalWithdrawal FROM withdrawals WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else {
               console.log('Total withdrawal: ', result);
               resolve(result) 
            }
        })
    })
}

// Function to create the user affiliate balance view
async function createAffiliateBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW affiliate_balance AS SELECT amount, transaction_type, transaction_date FROM affiliate_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating affiliate_balance view: ', err);
                reject(err);
            } else {
                console.log('Affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total affiliate balance view
async function getTotalAffiliateBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS affiliateBalance FROM affiliate_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total affiliate balance: ', err);
                reject(err);
            } else{
                console.log('Total affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total direct referral balance
async function getTotalReferralBalanceView(type) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS balance FROM affiliate_balance WHERE transaction_type = ?', type, (err, result)=>{
            if (err) {
                console.log('Error fetching the total referral balance: ', err);
                reject(err);
            } else{
                console.log('Total referral balance: ', result);
                resolve(result);
            }
        })
    })
}


// Function to create the user non affiliate balance view
async function createNonAffiliateBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW non_affiliate_balance AS SELECT amount, transaction_type, transaction_date FROM non_affiliate_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating non_affiliate_balance view: ', err);
                reject(err);
            } else {
                console.log('Non Affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total non affiliate balance view
async function getTotalNonAffiliateBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS nonAffiliateBalance FROM non_affiliate_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total non affiliate balance: ', err);
                reject(err);
            } else{
                console.log('Total non affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to create the user game balance view
async function createGameBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW game_balance AS SELECT amount, transaction_date FROM game_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating game_balance view: ', err);
                reject(err);
            } else {
                console.log('Game balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total game balance view
async function getTotalGameBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS gameBalance FROM game_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total game balance: ', err);
                reject(err);
            } else{
                console.log('Total game balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to insert into affiliate transactions table
async function insertIntoAffiliateTransactions(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into affiliate_transactions table: ', err);
                reject(err);
            } else {
                console.log('Successfully inserted into the affiliate transactions table');
                resolve(result);
            }
        })
    })
}

// Function to insert into non affiliate transactions table
async function insertIntoNonAffiliateTransactions(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into non_affiliate_transactions table: ', err);
                reject(err);
            } else {
                console.log('Successfully inserted into the non affiliate transactions table');
                resolve(result);
            }
        })
    })
}

// Function to insert into the withdrawals table
async function insertIntoWithdrawals(userId, username, amount, withdrawalType, bank, accountNumber, accountName) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO withdrawals (user_id, user, amount, withdrawal_type, bank, account_number, account_name) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, username, amount, withdrawalType, bank, accountNumber, accountName], (err, result)=>{
            if (err) {
                console.log('Error inserting into withdrawals table: ', err);
                reject(err);
            } else{
                console.log('Successfully inserted into the withdrawals table');
                resolve(result);
            }
        })
    })
}

// Function to get the vendor's coupon codes
async function getCoupons(userId, isUsed) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM registeration_tokens WHERE vendor_id = ? AND is_used = ?', [userId, isUsed], (err, result)=>{
        if (err) {
            console.log('Error getting vendor coupons: ', err);
            reject(err);
        } else {
            console.log('Vendor coupons: ', result);
            resolve(result);
        }
    });
  });  
} 

// Function to insert into the game transactions table
async function insertIntoGameTransactions(userId, amount) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO game_transactions (user_id, amount) VALUES (?, ?)', [userId, amount], (err, result) => {
            if (err) {
                console.log('Error inserting into game transactions table: ', err);
                reject(err);
            } else{
                console.log('Successfully inserted into the game transactions table');
                resolve(result);
            }
        });
    });
}

// Function to update the has_played_game column
async function updateGameColumn(userId, status) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_played_game = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the has_played_game column of the user: ', err);
                reject(err);
            } else {
                console.log('Successfully updated the has_played_game column of the user');
                resolve(result)
            }
        });
    });
}

// Function to get all posts
async function getPosts() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM primetech_posts', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(result);
                resolve(result);
            }
        });
    });
}

// Function to get post with id
async function getSinglePost(postId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM primetech_posts WHERE post_id = ?', postId, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(result);
                resolve(result);
            }
        });
    });
}

// Function to update the has_shared_post colum
async function updateHasSharedPostColumn(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_shared_post = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the column: ', err);
                reject(err);
            } else{
                console.log('Successfully updated the has_shared_post column');
                resolve(result);
            }
        });
    });
}

// Function to credit user
async function creditUserForNonAffiliate(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error crediting the user: ', err);
                reject(err);
            } else{
                console.log('Successfully credited the user');
                resolve(result);
            }
        });
    });
}

module.exports = {fetchUserByUsername, getReferrals, getTotalWithdrawal, createAffiliateBalanceView, getTotalAffiliateBalanceView, getTotalReferralBalanceView, createNonAffiliateBalanceView, getTotalNonAffiliateBalanceView, createGameBalanceView, getTotalGameBalanceView, insertIntoAffiliateTransactions, insertIntoNonAffiliateTransactions, insertIntoWithdrawals, getCoupons, insertIntoGameTransactions, updateGameColumn, getPosts, getSinglePost, updateHasSharedPostColumn, creditUserForNonAffiliate};