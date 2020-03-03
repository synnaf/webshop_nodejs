// Här ska vi definiera vår server! Men vi ska inte starta den
// (alltså app.listen(port, ()=>{}), har vi inte i denna fil, utan i index.js)
const express = require('express')
const sassMiddleware = require('node-sass-middleware')
const app = express()
const PORT = process.env.PORT || 8080
//const productItem = require('../model/product')
const serverVariable = require('../serverVariable');
const adminRoute = require('../routes/adminRoute');
const userRoute = require('../routes/userRoute');
const galleryRoute = require('../routes/galleryRoute');
const errorRoute = require('../routes/errorRoute');

app.use(sassMiddleware({ // tell sassMiddleware where src file and dest directory is
    src: 'sass',
    dest: 'public',
    // debug: true, // för att skriva ut data till konsollen
    outputStyle: 'compressed'
}))
// define a static folder, 'public'
app.use(express.static('public'))
// 
app.use(express.urlencoded({
    extended: true
}));
// define what view engine to use, ejs in this case
app.set('view engine', 'ejs')



app.use(adminRoute);

app.use(userRoute);

app.use(galleryRoute);

app.use(errorRoute);
// ------------------  Routs  -------------------//
app.get(serverVariable.ROUTE.index, (req, res) => {
    res.status(200).render(serverVariable.VIEW.index, {})
})

module.exports = {
    app,
    PORT,
    express
}