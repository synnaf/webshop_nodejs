const express = require('express');
const router = express.Router();
const productModel = require('../model/product');
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.gallery, async (req, res) => {
    const productModelSave = await productModel.find()
    res.render(serverVariable.VIEW.gallery, {
        productModelSave
    });
})

router.get(serverVariable.ROUTE.product, (req, res) => {
    res.status(200).render(serverVariable.VIEW.product);
})

module.exports = router;