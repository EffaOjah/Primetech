const connection = require('../db/db');

/* Function to change the is_used column 
of the registeration_tokens table to true */
async function updateIsUsedColumn(res, token){
    return new Promise((resolve, reject) => {
        connection.query('UPDATE registeration_tokens SET is_used = TRUE WHERE token = ?', [token], (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully updated the is_used column to TRUE');
                resolve(result);
            }
        });
    });
}

// Function to set the user of the coupon code
async function setUserId(res, token, userId){
    return new Promise((resolve, reject) => {
        connection.query('UPDATE registeration_tokens SET user_id = ? WHERE token = ?', [userId, token], (err, result)=>{
            if (err) {
                reject(err)
            } else{
                console.log('Successfully set the userId of the coupon code');
                resolve(result);
            }
        });
    });
}

// Function to set the usage date of the coupon code
async function setUsageDate(res, token) {
    return new Promise((resolve, reject) => {
        const date = new Date().toDateString();

        connection.query('UPDATE registeration_tokens SET date_used = ? WHERE token = ?', [date, token], (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully set the usage date of the coupon code');
                resolve(result);
            }
        });
    });
}

// Function to credit the newly registered user
async function creditNewUser(res, userId) {
    return new Promise((resolve, reject) => {
        let welcomeBonus = 3000;

        // Insert into the transactions table
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [welcomeBonus, 'Welcome Bonus', userId], async (err2)=>{
            if (err2){
                console.log(err2);
                reject(err2);
            } else{
                console.log('Successfully inserted into the transactions table');

                // Insert into the earning_history table
                connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['Welcome bonus', welcomeBonus, userId], (err2)=>{
                    if (err2) {
                        console.log(err2);
                        reject(err2);
                    } else{
                        console.log('Successfully inserted into the earning_history table');
                        resolve('success');
                    }
                });
            }
        });
    });
}

/////// Getting the uplines for crediting ///////
// Function to get the upline
async function getReferrer(referrer){
   return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE referral_code = ?', referrer, (err, result)=>{
        if (err) {
            console.log(err);
            reject(err);
        } else{
            resolve(result);
        }
    })
   })
}



/////// Crediting the uplines ///////
// Function to credit direct referral
// async function creditDirectReferral(res, referrer){
//     return new Promise((resolve, reject) => {
//         let amountToAdd = 4000;

//         connection.query('UPDATE users SET direct_referral_balance = direct_referral_balance + ? WHERE referral_code = ?', [amountToAdd, referrer], (err, result)=>{
//             if (err){
//                 console.log(err);
//                 reject(err);
//             } else{
//                 console.log('Successfully credited the user for direct referral bonus');
//                 resolve(result);
//             }
//         })
//     })
// }


// // Function to credit first Indirect referral
// async function creditFirstIndirectReferral(referrer){
//     return new Promise((resolve, reject) => {
//         let amountToAdd = 300;

//         connection.query('UPDATE users SET first_indirect_referral_balance = first_indirect_referral_balance + ? WHERE referral_code = ?', [amountToAdd, referrer], (err, result)=>{
//             if (err){
//                 console.log(err);
//                 reject(err);
//             } else{
//                 console.log('Successfully credited the user for first indirect referral bonus');
//                 resolve(result);
//             }
//         })
//     })
// }



module.exports = {updateIsUsedColumn, setUserId, setUsageDate, creditNewUser, getReferrer};