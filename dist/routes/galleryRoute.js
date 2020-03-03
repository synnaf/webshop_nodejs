'use strict';

var express = require('express');
var router = express.Router();
// const Product = require('../model/product');
var serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.gallery, function (req, res) {
    res.status(200).render(serverVariable.VIEW.gallery);
});

router.get(serverVariable.ROUTE.product, function (req, res) {
    res.status(200).render(serverVariable.VIEW.product);
});

module.exports = router;