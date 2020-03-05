const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');

router.get(constant.ROUTE.gallery, async (req, res) => {
    const showProduct = await Product.find()
    res.render(constant.VIEW.gallery, {
        showProduct
    });
})

router.get(constant.ROUTE.product, (req, res) => {
    res.status(200).render(constant.VIEW.product);
})

module.exports = router;