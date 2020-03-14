const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');
const url = require('url');

router.get(constant.ROUTE.index, (req, res) => {
    res.render(constant.VIEW.index, {});
})

router.get(constant.ROUTE.gallery, async (req, res) => {
    if ((req.query.page === undefined) || (req.query.genre === undefined)) {
        res.redirect(url.format({
            pathname: constant.ROUTE.gallery,
            query: {
                "page": 1,
                "genre": "all"
            }
        }));
    } else {
        const productPerPage = 4;
        const page = +req.query.page;
        const genre = req.query.genre;
        let productAmount = 0;
        if (genre === "all") {
            productAmount = await Product.find().countDocuments();
        } else {
            productAmount = await Product.find({genre: genre}).countDocuments();
        }
        
        const pageAmount = Math.ceil(productAmount / productPerPage);
        
        if (Number.isInteger(page) && (page >= 1) && (page <= pageAmount)) {
            let productList = [];
            if (genre === "all") {
                productList = await Product.find().skip(productPerPage * (page - 1)).limit(productPerPage);
            } else {
                productList = await Product.find({genre: genre}).skip(productPerPage * (page - 1)).limit(productPerPage);
            }
            res.render(constant.VIEW.gallery, {
                productList,
                productAmount,
                currentPage: page,
                isFirst: page <= 1,
                isSecond: page === 2,
                isLast: page === pageAmount,
                isSecondLast: page === (pageAmount - 1),
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: pageAmount,
                productListRoute: constant.ROUTE.gallery,
                genre: genre
            });
        } else {
            res.redirect(url.format({
                pathname: constant.ROUTE.error,
                query: {}
            }));
        }
    }
})
router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

module.exports = router;