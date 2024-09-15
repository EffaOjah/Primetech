const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const helmet = require('helmet');

const app = express();

// Setup MySQL connection
const connection = require('./db/db.js');

const cookieParser = require('cookie-parser');

// // Set app to use cors
// app.use(cors());

// // Set app to use helmet
// // Use Helmet to set various security headers, including CSP
// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://kit.fontawesome.com/a207e207d8.js"], // Add your external script sources here
//       },
//     })
//   );

// Set app to use ejs
app.set('view engine', 'ejs');

// Set app to use static files
app.use(express.static('public'));

// Initialize body parser
app.use(bodyParser.urlencoded({extended: true}));

// Use express.json
app.use(express.json());

// Use cookie parser
app.use(cookieParser());

// Connect database
connection.connect(err => {
    if(err){
        console.log('Database connection failed');
    } else {
        console.log('Database connection successful');
    }
});

// Controllers
const viewPagesController = require('./Contollers/viewPagesController');
const authController = require('./Contollers/authContoller');
const dashboardPagesController = require('./Contollers/dashboardPagesController');
const vendorController = require('./Contollers/vendorController.js');
const adminController = require('./Contollers/adminController.js');

// Make app to use the controllers
app.use(viewPagesController);
app.use(authController);
app.use(dashboardPagesController);
app.use(vendorController);
app.use(adminController);

app.listen(1000, ()=>{
    console.log('Server is listening on port 1000');
});