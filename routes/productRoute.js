const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');

router.get(constant.ROUTE.index, (req, res) => {
    res.render(constant.VIEW.index, {});
})

router.get(constant.ROUTE.gallery, async (req, res) => {
    const productPerPage = 3;
    const page = +req.query.page;
    const productAmount = await Product.find().countDocuments();
    const productList = await Product.find().skip(productPerPage * (page - 1)).limit(productPerPage);
    res.render(constant.VIEW.gallery, {
        productList,
        productAmount,
        currentPage: page,
        isFirst: page <= 1,
        isSecond: page == 2,
        isLast: page === Math.ceil(productAmount / productPerPage),
        isSecondLast: page === (Math.ceil(productAmount / productPerPage) - 1),
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productAmount / productPerPage),
        productListRoute: constant.ROUTE.gallery
    });
})

router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

module.exports = router;