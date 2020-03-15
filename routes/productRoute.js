const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const constant = require('../constant');
const url = require('url');

const EXPRESSION = {
    genres: ["all", "Rock", "Pop", "Soul", "Rap", "Rnb", "Blues"],
    productPerPage: 4
}

router.get(constant.ROUTE.index, async (req, res) => {
    let imageList = [];
    for (const genre of EXPRESSION.genres) {
        imageList.push(await Product.findOne({genre: genre}, { genre: 1, imgUrl: 1, _id: 0 }));
    }
    imageList = imageList.filter(el => el);
    console.log(imageList);
    res.render(constant.VIEW.index, {imageList: imageList, productListRoute: constant.ROUTE.gallery});
})

router.get(constant.ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(constant.VIEW.product, { oneProduct });
})

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

const validateListQuery = async (query) => {
    return new Promise(async (resolve, reject) => {
        if (Number.isInteger(+query.page) && EXPRESSION.genres.includes(query.genre)) {
            resolve(query);
        } else {
            let error = new Error();
            error.name = "Invalid Query"
            error.errmsg = "page is not an integer or genre does not exist";
            reject(error);
        }
    })
}

const getData = async (query) => {
    return new Promise(async (resolve, reject) => {
        const page = +query.page;
        const genre = query.genre;
        let productAmount = 0;
        if (genre === "all") {
            productAmount = await Product.find().countDocuments();
        } else {
            productAmount = await Product.find({genre: genre}).countDocuments();
        }
        const pageAmount = Math.ceil(productAmount / EXPRESSION.productPerPage);
        if ((page >= 1) && (page <= pageAmount)) {
            let productList = [];
            if (genre === "all") {
                productList = await Product.find().skip(EXPRESSION.productPerPage * (page - 1)).limit(EXPRESSION.productPerPage);
            } else {
                productList = await Product.find({genre: genre}).skip(EXPRESSION.productPerPage * (page - 1)).limit(EXPRESSION.productPerPage);
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
            console.log(productList);
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.errmsg = "page is not within range"
            reject(error);
        }
    })
}

module.exports = router;