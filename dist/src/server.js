'use strict';

var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var PORT = process.env.PORT || 8080;
var adminRoute = require('../routes/adminRoute');
var userRoute = require('../routes/userRoute');
var checkOutRoute = require('../routes/checkoutRoute');
var productRoute = require('../routes/productRoute');
var errorRoute = require('../routes/errorRoute');
var cookieParser = require('cookie-parser');

app.use(sassMiddleware({
    src: 'sass',
    dest: 'public',
    outputStyle: 'compressed'
}));

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(checkOutRoute);

app.use(adminRoute);

app.use(userRoute);

app.use(productRoute);

app.use(errorRoute);

module.exports = {
    app: app,
    PORT: PORT,
    express: express
};