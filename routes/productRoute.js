const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { ROUTE, VIEW, PRODUCT } = require('../constant');
const url = require('url');

router.get(ROUTE.index, async (req, res) => {
    let displayList = [];
    for (const genre of PRODUCT.genres) {
        const img = await Product.findOne({ genre: genre }, { imgUrl: 1, _id: 0 });
        if (img) {
            displayList.push({
                img: img.imgUrl,
                genre: genre
            });
        }
    }
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
                    query: {
                        errmsg: error.errmsg
                    }
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
            error.name = "Invalid Query";
            error.description = "page is not an integer";
            error.errmsg = "Kunde inte hitta sidan";
            reject(error);
        }
    })
}

const validateGenre = async (query) => {
    return new Promise(async (resolve, reject) => {
        if (query.genre !== undefined) {
            let correct = true;
            const genres = query.genre.split(",");
            for (const genre of genres) {
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
                error.name = "Invalid Query";
                error.description = "genre does not exist";
                error.errmsg = "Kunde inte hitta sidan";
                reject(error);
            }
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.description = "genre is undefined";
            error.errmsg = "Kunde inte hitta sidan";
            reject(error);
        }
    })
}

const getData = async (queryObject, token) => {
    return new Promise(async (resolve, reject) => {
        const page = queryObject.page;
        const genres = queryObject.genres;
        let productAmount = 0;
        for (const genre of genres) {
            productAmount += await Product.find({ genre: genre }).countDocuments();
        }
        const pageAmount = Math.ceil(productAmount / PRODUCT.perPage);
        if ((page >= 1) && (page <= pageAmount)) {
            const perGenre = Math.ceil(PRODUCT.perPage / genres.length);
            let productList = [];
            for (const genre of genres) {
                productList = productList.concat(await Product.find({ genre: genre }).skip(perGenre * (page - 1)).limit(perGenre));
            }
            const genreString = genres.toString();
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
                ROUTE: ROUTE,
                genre: genreString
            });
        } else {
            let error = new Error();
            error.name = "Invalid Query";
            error.description = "page is not within range";
            error.errmsg = "Kunde inte hitta sidan";
            reject(error);
        }
    })
}

module.exports = router;
