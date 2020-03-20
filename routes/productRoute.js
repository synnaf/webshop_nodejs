const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const {ROUTE, VIEW, PRODUCT} = require('../constant');
const url = require('url');

router.get(ROUTE.index, async (req, res) => {
    let displayList = [];
    for (const genre of PRODUCT.genres) {
        displayList.push({
            img: await Product.findOne({genre: genre}, { imgUrl: 1, _id: 0 }),
            genre: genre
        });
    }
    displayList = displayList.filter(el => el);
    res.render(VIEW.index, {
        displayList: displayList,
        productListRoute: ROUTE.gallery,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

router.get(ROUTE.product, async (req, res) => {
    const oneProduct = await Product.findById({ _id: req.params.id });
    res.render(VIEW.product, { oneProduct, token: (req.cookies.jsonwebtoken !== undefined) ? true : false });
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
        validatePage(req.query)
        .then(async query => {
            return await validateGenre(query);
        })
        .then(async queryObject => {
            return await getData(queryObject, req.cookies.jsonwebtoken);
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

const validatePage = async (query) => {
    return new Promise(async (resolve, reject) => {
        if (Number.isInteger(+query.page)) {
            resolve(query);
        } else {
            let error = new Error();
            error.name = "Invalid Query"
            error.errmsg = "page is not an integer";
            reject(error);
        }
    })
}

const validateGenre = async (query) => {
    return new Promise(async (resolve, reject) => {
        if (query.genre !== undefined) {
            let correct = true;
            const genres = query.genre.split(",");
            for (genre of genres) {
                if (!PRODUCT.genres.includes(genre)) {
                    correct = false;
                    break;
                }
            }
            if (correct) {
                const queryObject = {
                    genres: genres,
                    page: +query.page
                }
                resolve(queryObject);
            } else {
                let error = new Error();
                error.name = "Invalid Query"
                error.errmsg = "genre does not exist";
                reject(error);
            }
        } else {
            let error = new Error();
            error.name = "Invalid Query"
            error.errmsg = "genre is undefined";
            reject(error);
        }
    })
}

const getData = async (queryObject, token) => {
    return new Promise(async (resolve, reject) => {
        const page = queryObject.page;
        const genres = queryObject.genres;
        let productAmount = 0;
        for (genre of genres) {
            productAmount += await Product.find({genre: genre}).countDocuments();
        }
        const pageAmount = Math.ceil(productAmount / PRODUCT.perPage);
        if ((page >= 1) && (page <= pageAmount)) {
            let productList = [];
            for (genre of genres) {
                productList = productList.concat(await Product.find({genre: genre}).skip(PRODUCT.perPage * (page - 1)).limit(PRODUCT.perPage));
            }
            resolve({
                token: (token !== undefined) ? true : false,
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
                genre: genres[0]
            });
            // console.log(productList);
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.errmsg = "page is not within range"
            reject(error);
        }
    })
}

module.exports = router;