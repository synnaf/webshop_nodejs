const express = require('express')
const sassMiddleware = require('node-sass-middleware')
const app = express();
const PORT = process.env.PORT || 8080;
const adminRoute = require('../routes/adminRoute');
const userRoute = require('../routes/userRoute');
const checkOutRoute = require('../routes/checkoutRoute');
const productRoute = require('../routes/productRoute');
const errorRoute = require('../routes/errorRoute');
const cookieParser = require('cookie-parser')


app.use(sassMiddleware({
    src: 'sass',
    dest: 'public',
    outputStyle: 'compressed'
}))

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs')

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
