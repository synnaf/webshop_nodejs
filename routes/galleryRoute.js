const express = require('express');
const router = express.Router();
// const Product = require('../model/product');
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.gallery, (req, res) => {
    res.status(200).render(serverVariable.VIEW.gallery);
})

router.get(serverVariable.ROUTE.product, (req, res) => {
    res.status(200).render(serverVariable.VIEW.product);
})

module.exports = router;