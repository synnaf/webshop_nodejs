const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');
const url = require('url');

router.get(constant.ROUTE.index, (req, res) => {
    res.render(constant.VIEW.index, {});
})

const validateListQuery = async (query) => {
    return new Promise(async (resolve, reject) => {
        const genres = ["all", "Rock", "Pop", "Soul", "Rap", "Rnb"];
        if (Number.isInteger(+query.page) && genres.includes(query.genre)) {
            resolve(query);
        } else {
            reject();
        }
    })
}

const getData = async (query) => {
    return new Promise(async (resolve, reject) => {
        const page = +query.page;
        const genre = query.genre;
        const productPerPage = 1;
        let productAmount = 0;
        if (genre === "all") {
            productAmount = await Product.find().countDocuments();
        } else {
            productAmount = await Product.find({genre: genre}).countDocuments();
        }
        const pageAmount = Math.ceil(productAmount / productPerPage);
        if ((page >= 1) && (page <= pageAmount)) {
            let productList = [];
            if (genre === "all") {
                productList = await Product.find().skip(productPerPage * (page - 1)).limit(productPerPage);
            } else {
                productList = await Product.find({genre: genre}).skip(productPerPage * (page - 1)).limit(productPerPage);
            }
            resolve({
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
            reject();
        }
    })
}

router.get(constant.ROUTE.gallery, async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res.redirect(url.format({
            pathname: constant.ROUTE.gallery,
            query: {
                "genre": "all",
                "page": 1
            }
        }));
    } else {
        validateListQuery(req.query)
        .then(async query => {
            return await getData(query)
        })
        .then(async object => {
            res.render(constant.VIEW.gallery, object);
        })
        .catch(error => {
            console.error(error);
            res.redirect(url.format({
                pathname: constant.ROUTE.error,
                query: {}
            }));
        });
    }
})

router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

module.exports = router;