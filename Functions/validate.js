// Require MySQL connection
const connection = require('../db/db');
const md5 = require('md5');

const otherFunctions = require('../Functions/functions');

function validate(emailAddress, username, password, firstName, lastName, phoneNumber, referralId, couponCode, referralCode, connection, data, res, errors, resolve, reject) {
    // Define error for invalid email
    if(otherFunctions.validateEmail(emailAddress)){
        connection.query('INSERT INTO users (username, password, first_name, last_name, email, phone_number, referral_code, registeration_token, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, password, firstName, lastName, emailAddress, phoneNumber, referralId, couponCode, referralCode], (err, result, errors) => {

        
          // Handle the errors
          let unhashedPassword = data.password;
          
          if (err) { 
            console.error(err);
        
            // Define error for already existing username
            if (err.code == 'ER_DUP_ENTRY' && err.sqlMessage.includes('username')){
              errors = 'Username has been used by someone else';
            }
            // Define error for already existing email
            if (err.code == 'ER_DUP_ENTRY' && err.sqlMessage.includes('email')){
              errors = 'Email has been used by someone else';
            }
            // Define error for already existing phone number
            if (err.code == 'ER_DUP_ENTRY' && err.sqlMessage.includes('phone_number')){
              errors = 'Phone number has been used by someone else';
            }
            // Define error for password length
            if(unhashedPassword.length < 8){
              errors = 'Password must be 8 characters or above';
            }    
            
            reject(errors);
          } else {
          // If there was no error, proceed
          resolve(result);
          }
        
        });
      } 
}

// Function to check username
async function checkUsername(username){
  return new Promise((resolve, reject)=>{
    connection.query('SELECT * FROM users WHERE username = ?', username, (err, result)=>{
      if (err) {
        console.log(err);
        reject(err)
      } else{
        console.log(result);
        resolve(result)
      }
    })
  })
}


// Function to check email
async function checkEmail(email){
  return new Promise((resolve, reject)=>{
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, result)=>{
      if (err) {
        console.log(err);
        reject(err)
      } else{
        console.log(result);
        resolve(result)
      }
    })
  })
}


// Function to create the new user
async function createUser(firstName, lastName, username, phoneNumber, email, password, referralCode){
  return new Promise((resolve, reject)=>{
    const hashedPassword = md5(password);
    connection.query('INSERT INTO users (first_name, last_name, username, phone_number, email, password, referral_code) VALUES(?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, username, phoneNumber, email, hashedPassword, referralCode], (err, result)=>{
      if (err) {
        console.log(err);
        reject(err);
      } else{
        console.log('Successfully Created the user: ', result);
        resolve(result);
      }
    })
    })
}


// Function to debit the user, after the P2P registration
async function debitUser(userId){
  return new Promise((resolve, reject)=>{
    const amountToDebit = 5000;
    connection.query('UPDATE users SET total_activities_balance = total_activities_balance - ? WHERE user_id = ?', [amountToDebit, userId], (err, result)=>{
      if (err) {
        console.log(err);
        reject(err);
      } else{
        console.log('Successfully debited the registrar');
        resolve(result);
      }
    })
  })
}


// Function to credit the newly registered user with the welcome bonus
async function creditNewUser(userId){
  return new Promise((resolve, reject)=>{
    const amountToAdd = 2700;
    connection.query('UPDATE users SET total_activities_balance = total_activities_balance + ? WHERE user_id = ?', [amountToAdd, userId], (err, result)=>{
      if (err){
        console.log(err);
        reject(err);
      } else{
        console.log('Successfully credited the new user😃');
        resolve(result);
      }
    })
  })
}


module.exports = {validate, checkUsername, checkEmail, createUser, debitUser, creditNewUser};