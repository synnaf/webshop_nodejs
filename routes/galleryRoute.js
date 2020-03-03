const express = require('express');
const router = express.Router();
const products = require('../model/product');
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.gallery, async (req, res) => {
    const showProduct = await products.find()
    res.render(serverVariable.VIEW.gallery, {
        showProduct
    });
})

router.get(serverVariable.ROUTE.product, (req, res) => {
    res.status(200).render(serverVariable.VIEW.product);
})

module.exports = router;