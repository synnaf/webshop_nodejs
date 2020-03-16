const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const {ROUTE, VIEW, PRODUCT} = require('../constant');
const url = require('url');

router.get(ROUTE.index, async (req, res) => {
    let displayList = [];
    for (const genre of PRODUCT.genres) {
        displayList.push(await Product.findOne({genre: genre}, { genre: 1, imgUrl: 1, _id: 0 }));
    }
    displayList = displayList.filter(el => el);
    console.log(displayList);
    res.render(VIEW.index, {displayList: displayList, productListRoute: ROUTE.gallery});
})

router.get(ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(VIEW.product, { oneProduct });
})

router.get(ROUTE.gallery, async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res.redirect(url.format({
            pathname: ROUTE.gallery,
            query: {
                "genre": "All",
                "page": 1
            }
        }));
    } else {
        validateListQuery(req.query)
        .then(async query => {
            return await getData(query)
        })
        .then(async object => {
            res.render(VIEW.gallery, object);
        })
        .catch(error => {
            console.error(error);
            res.redirect(url.format({
                pathname: ROUTE.error,
                query: {}
            }));
        });
    }
})

const validateListQuery = async (query) => {
    return new Promise(async (resolve, reject) => {
        if (Number.isInteger(+query.page) && PRODUCT.genres.includes(query.genre)) {
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
        if (genre === "All") {
            productAmount = await Product.find().countDocuments();
        } else {
            productAmount = await Product.find({genre: genre}).countDocuments();
        }
        const pageAmount = Math.ceil(productAmount / PRODUCT.perPage);
        if ((page >= 1) && (page <= pageAmount)) {
            let productList = [];
            if (genre === "All") {
                productList = await Product.find().skip(PRODUCT.perPage * (page - 1)).limit(PRODUCT.perPage);
            } else {
                productList = await Product.find({genre: genre}).skip(PRODUCT.perPage * (page - 1)).limit(PRODUCT.perPage);
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
                productListRoute: ROUTE.gallery,
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