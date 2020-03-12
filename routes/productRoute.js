const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');
const url = require('url');

router.get(constant.ROUTE.index, (req, res) => {
    res.render(constant.VIEW.index, {});
})

router.get(constant.ROUTE.gallery, async (req, res) => {
    if (req.query.page === undefined) {
        res.redirect(url.format({
            pathname: constant.ROUTE.gallery,
            query: {
                "page": 1
            }
        }));
    }
    const productPerPage = 4;
    const page = +req.query.page;
    const productAmount = await Product.find().countDocuments();
    if (Number.isInteger(page) && (page >= 1) && (page <= Math.ceil(productAmount / productPerPage))) {
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
    } else {
        res.redirect(url.format({
            pathname: constant.ROUTE.error,
            query: {}
        }));
    }
    
})

router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

module.exports = router;