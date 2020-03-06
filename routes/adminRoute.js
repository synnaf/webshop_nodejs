const express = require('express');
const router = express.Router();
const Admin = require('../model/user');
const Product = require('../model/product');
const constant = require('../constant');
const request = require('request'); // "Request" library
const config = require("../config/config");


router.get(constant.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(constant.VIEW.loginAdmin, { constant });
})

router.post(constant.ROUTE.loginAdmin, async (req, res) => {
    const admin = await Admin.findOne({ adminName: req.body.adminName });

    if (!admin) {
        res.redirect(constant.ROUTE.index);
    }

    // const validAdmin = await bcrypt.compare(req.body.adminPassword, admin.adminPassword);

    if (req.body.adminPassword == admin.adminPassword) {
        res.redirect(constant.ROUTE.admin);
    }

    res.redirect(constant.ROUTE.loginAdmin);
})

router.get(constant.ROUTE.admin, async (req, res) => {
    res.status(200).render(constant.VIEW.admin, { Product })
})

router.post(constant.ROUTE.admin, (req, res) => {

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
                    console.log(JSON.parse(body).albums.items[0].artists[0].name);
                    //gör ett if-statement fär vi hanterar det som kommer tillbaka i body (vårt response) 
                    //re-routa till error sidan annars! 
                    const spotifyResponse = JSON.parse(body).albums;

                    // const product = new Product({
                    //     artist: spotifyResponse.items[0].artists[0].name,
                    //     album: spotifyResponse.items[0].name,
                    //     spotifyId: spotifyResponse.items[0].artists[0].id,
                    //     tracks: spotifyResponse.items[0].total_tracks,
                    //     genre: spotifyResponse.items[0].total_tracks,
                    //     imgUrl: spotifyResponse.items[0].images[0].url
                    // })
                    console.log(spotifyResponse);
                    res.render(constant.VIEW.adminAddProduct, { spotifyResponse })
                });

            }
        });
    }
})

module.exports = router;