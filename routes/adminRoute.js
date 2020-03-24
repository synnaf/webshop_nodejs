const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { ROUTE, VIEW, PRODUCT } = require('../constant');
const request = require('request'); // SPOTIFY REQUEST LIBRARY
const config = require('../config/config');
const bcrypt = require('bcrypt');
const url = require("url");
const verifyAdminToken = require('./verifyAdminToken');
const verifyToken = require('./verifyToken');


router.get(ROUTE.admin, verifyToken, async (req, res) => {

    const productList = await (await (Product.find().populate('user -password'))).reverse()
    res.render(VIEW.admin, {
        productList,
        ROUTE,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    })
    console.log('TOKEN NÄR MAN ÄR PÅ ADMIN', req.body.userInfo)
})

router.post(ROUTE.admin, verifyToken, (req, res) => {

    const artistSearchValue = req.body.artist;
    const albumSearchValue = req.body.album;

    // THIS FUNCTION WILL AUTHORIZE AND FETCH DATA USING THE SPOTIFY API
    // DATA WILL BE BASED ON THE VALUE FROM THE INPUTFIELDS IN ADMIN.EJS
    function fetchSpotifyApiData(artistSearchValue, albumSearchValue) {
        //------------------------------ SPOTIFY AUTH ---------------------------- //

        /**
         * This is an example of a basic node.js script that performs
         * the Client Credentials oAuth2 flow to authenticate against
         * the Spotify Accounts.
         *
         * For more information, read
         * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
         */

        //CREATE A REQUEST
        const client_id = config.spotify.client_id; // CLIENT ID
        const client_secret = config.spotify.client_secret; // CLIENT SECRET
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log('no error and got statuscode 200')

                // USE THE ACCESS TOKEN TO ACCESS THE SPOTIFY WEB API
                var token = body.access_token;

                var options = {
                    url: `https://api.spotify.com/v1/search?q=album:${albumSearchValue}%20artist:${artistSearchValue}&type=album&q=`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                request.get(options, function (error, response, body) {
                    //console.log(response.statusCode + "===== is the response status code for request.get")
                    //console.log(JSON.parse(body).albums);

                    // RETURN THE SPOTIFY API DATA AS A JSON OBJECT
                    const spotifyResponse = JSON.parse(body).albums;
                    const userInfo = req.body.userInfo;

                    if (spotifyResponse.items == 0) {
                        res.redirect(url.format({
                            pathname: ROUTE.error,
                            query: {
                                errmsg: 'Titeln saknas hos spotify!'
                            }
                        }));
                    } else {
                        const genres = PRODUCT.genres.filter(genre => {
                            return genre !== "All";
                        });
                        res.render(VIEW.adminAddProduct, {
                            ROUTE,
                            userInfo: userInfo,
                            spotifyResponse: spotifyResponse,
                            genres: genres,
                            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
                        });
                        console.log('USERINFO NÄR MAN SKA ADDPRODUCT', req.body.userInfo)
                    }
                });
            }
        });
    }
    fetchSpotifyApiData(artistSearchValue, albumSearchValue)
})

router.post(ROUTE.adminAddProduct, async (req, res) => {
    console.log(req.body)
    let genres = ["All"];
    for (const property in req.body) {
        if (property.includes("genre")) {
            genres.push(property.replace("genre", ""));
        }
    }
    const product = await new Product({
        artist: req.body.artist,
        album: req.body.album,
        tracks: req.body.tracks,
        spotifyId: req.body.spotifyId,
        imgUrl: req.body.imgUrl,
        genre: genres,
        price: req.body.price,
        addedBy: req.body.adminName
    });

    product.validate(function (err) {
        if (err) {
            console.log(err);
            res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: 'Valideringsfel i Mongoose'
                }
            }));
        } else {
            console.log(product)
            product.save();
            res.redirect(ROUTE.admin);
        }
    });
})
module.exports = router;