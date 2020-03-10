const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');

router.get(constant.ROUTE.index, (req, res) => {
    res.render(constant.VIEW.index, {})
})

router.get(constant.ROUTE.gallery, async (req, res) => {
    const showProduct = await Product.find()
    res.render(constant.VIEW.gallery, {
        showProduct
    });
})

router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

module.exports = router;