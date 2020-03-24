/* THIS IS WHERE WE DEFINE OUR SERVER BUT WE WILL NOT START THE APP FROM HERE. OUR ENTRYPOINT IS INDEX.JS */

const express = require('express')
const sassMiddleware = require('node-sass-middleware')
const app = express()
const PORT = process.env.PORT
const constant = require('../constant');
const adminRoute = require('../routes/adminRoute');
const userRoute = require('../routes/userRoute');
const checkOutRoute = require('../routes/checkoutRoute');
const productRoute = require('../routes/productRoute');
const errorRoute = require('../routes/errorRoute');
const cookieParser = require('cookie-parser')


app.use(sassMiddleware({
    // TELL SASSMIDDLEWARE WHERE SRC FILE AND DEST DIRECTORY IS
    src: 'sass',
    dest: 'public',
    outputStyle: 'compressed'
}))
// DEFINE A STATIC PUBLIC DIRECTORY
app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}));
// DEFINE WHAT VIEW ENGINE TO USE. IN OUR CASE IT WILL BE EJS
app.set('view engine', 'ejs')

// ------------------  ROUTES  -------------------//
app.use(cookieParser());

app.use(checkOutRoute);

app.use(adminRoute);

app.use(userRoute);

app.use(productRoute);

app.use(errorRoute);

module.exports = {
    app,
    PORT,
    express
}