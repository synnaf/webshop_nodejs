const express = require('express');
const router = express.Router();
const Admin = require('../model/user');
const Product = require('../model/product');
const constant = require('../constant');
const request = require('request'); // "Request" library
const config = require('../config/config');
const bcrypt = require('bcrypt');


router.get(constant.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(constant.VIEW.loginAdmin, {
        constant
    });
})

router.post(constant.ROUTE.loginAdmin, async (req, res) => {
    const admin = await Admin.findOne({
        email: req.body.adminName
    });

    if (!admin.isAdmin) {
        res.redirect(constant.ROUTE.loginUser);
    }

    if (!admin) {
        res.redirect(constant.ROUTE.index);
    }

    const validAdmin = await bcrypt.compare(req.body.adminPassword, admin.password);

    if (validAdmin) {
        res.redirect(constant.ROUTE.admin);
    }

    res.redirect(constant.ROUTE.loginAdmin);
})

router.get(constant.ROUTE.admin, async (req, res) => {
    const productList = await Product.find()
    res.status(200).render(constant.VIEW.admin, {
        productList
    })
})

router.post(constant.ROUTE.admin, (req, res) => {

    //console.log(req.)
    // när man trycker på "Sök" så kör funktionen som auktoriserar spotify web api
    // värdet från inputfältet ska in i söksträngen 
    const artistSearchValue = req.body.artist;
    const albumSearchValue = req.body.album;
    // hämta information från spotify 
    fetchSpotifyApiData(artistSearchValue, albumSearchValue)

    //------------------------------ SPOTIFY AUTH ---------------------------- //

    /**
     * This is an example of a basic node.js script that performs
     * the Client Credentials oAuth2 flow to authenticate against
     * the Spotify Accounts.
     *
     * For more information, read
     * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
     */
    function fetchSpotifyApiData(artistSearchValue, albumSearchValue) {
        //skapa en request
        const client_id = config.spotify.client_id; // Your client id
        const client_secret = config.spotify.client_secret; // Your secret
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

                // use the access token to access the Spotify Web API
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
                    console.log(response.statusCode + "===== is the response status code for request.get")
                    console.log(JSON.parse(body).albums);
                    //gör ett if-statement fär vi hanterar det som kommer tillbaka i body (vårt response) 
                    //re-routa till error sidan annars! 
                    const spotifyResponse = JSON.parse(body).albums;


                    if (spotifyResponse.items == 0) {
                        res.render("errors", { errmsg: 'Titeln saknas hos Spotify' });
                    } else {
                        res.render(constant.VIEW.adminAddProduct, { spotifyResponse })
                    }


                });
            }
        });
    }
})

router.post(constant.ROUTE.adminAddProduct, async (req, res) => {
    console.log(req.body)
    const product = await new Product({
        artist: req.body.artist,
        album: req.body.album,
        tracks: req.body.tracks,
        spotifyId: req.body.spotifyId,
        imgUrl: req.body.imgUrl,
        genre: req.body.genre,
        price: req.body.price,
        addedBy: req.body.adminName
    });
    product.validate(function (err) {
        if (err) {
            console.log(err);
            res.render("errors", {
                err
            });
        } else {
            product.save();
            res.redirect(constant.ROUTE.admin);
        }
    });
})
module.exports = router;