const express = require('express');
const router = express.Router();
const products = require('../model/product');
const constant = require('../constant');

router.get(constant.ROUTE.gallery, async (req, res) => {
    const showProduct = await products.find()
    res.render(constant.VIEW.gallery, {
        showProduct
    });
})

router.get(constant.ROUTE.product, (req, res) => {
    res.status(200).render(constant.VIEW.product);
})

module.exports = router;