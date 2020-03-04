'use strict';

var express = require('express');
var router = express.Router();
// const Product = require('../model/product');
var constant = require('../constant');

router.get(constant.ROUTE.gallery, function (req, res) {
    res.status(200).render(constant.VIEW.gallery);
});

router.get(constant.ROUTE.product, function (req, res) {
    res.status(200).render(constant.VIEW.product);
});

module.exports = router;