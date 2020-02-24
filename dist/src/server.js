'use strict';

// Här ska vi definiera vår server! Men vi ska inte starta den
// (alltså app.listen(port, ()=>{}), har vi inte i denna fil, utan i index.js)
var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var PORT = process.env.PORT || 8080;
var productItem = require('../model/product');

var ROUTE = {
    main: '/',
    product: '/product',
    gallery: '/gallery',
    addProduct: '/add-product'
};

var VIEW = {
    gallery: 'gallery',
    product: 'product',
    addProduct: 'addProduct',
    main: 'main'
};

app.use(sassMiddleware({ // tell sassMiddleware where src file and dest directory is
    src: 'sass',
    dest: 'public',
    // debug: true, // för att skriva ut data till konsollen
    outputStyle: 'compressed'
}));
// define a static folder, 'public'
app.use(express.static('public'));
// 
app.use(express.urlencoded({ extended: true }));
// define what view engine to use, ejs in this case
app.set('view engine', 'ejs');

// ------------------  Routs  -------------------//
app.get(ROUTE.gallery, async function (req, res) {
    var productList = await productItem.find();
    res.status(200).render(VIEW.gallery, { productList: productList });
});

app.get(ROUTE.product, function (req, res) {
    res.status(200).render(VIEW.product, {});
});

app.post(ROUTE.addProduct, function (req, res) {
    // spara ny produkt
    new productItem({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imgUrl: req.body.imgUrl
    }).save(); // och spara till databasen

    res.status(200).redirect(ROUTE.gallery);
});

app.get(ROUTE.main, function (req, res) {
    res.status(200).render(VIEW.main, {});
});

app.get(ROUTE.addProduct, function (req, res) {
    res.status(200).render(VIEW.addProduct, {});
});

module.exports = { app: app, PORT: PORT, express: express };