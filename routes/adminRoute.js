const express = require('express');
const router = express.Router();
const ProductModel = require('../model/product');
const serverVariable = require('../serverVariable');
const request = require('request'); // "Request" library
const config = require("../config/config");


router.get(serverVariable.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.loginAdmin);
})

// router.get(serverVariable.ROUTE.admin, (req, res) => {
//     res.status(200).render(serverVariable.VIEW.admin);
// })

router.post(serverVariable.ROUTE.admin, (req, res) => {

    new ProductModel({
        artist: req.body.artist,
        vinylRecord: req.body.vinylRecord,
        vinylRecordPrice: req.body.vinylRecordPrice,
        vinylRecordDescription: req.body.vinylRecordDescription,
        imgUrl: req.body.imgUrl

    }).save()
    res.redirect("/gallery")
})

module.exports = router;



//------------------------------ SPOTIFY AUTH ---------------------------- //

router.get(serverVariable.ROUTE.admin, (req, res) => {
    // hämta information från spotify 
    // när man trycker på "Sök" så kör funktionen som auktoriserar spotify web api 
    // hämta värdet från input-fältet req.body.namnetpåfältet 
    // värdet från inputfältet ska in i söksträngen 
    // q=artistenfrånsökfältet

    //hämta från formulär 
    const artistSearchValue = req.body.artist

    const apiResponse = fetchSpotifyApiData(artistSearchValue)

    function fetchSpotifyApiData(searchValue) {
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
            searchValue = "beyonce"; // placeholder sökning, ta bort sen 

            if (!error && response.statusCode === 200) {
                console.log('no error and got statuscode 200')

                // use the access token to access the Spotify Web API
                var token = body.access_token;
                
                var options = {
                    url: `https://api.spotify.com/v1/search?type=artist&q=${searchValue}`,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                request.get(options, function (error, response, body) {
                    console.log(response.statusCode + "===== is the response status code for request.get")
                    console.log(body);
                    //gör ett if-statement fär vi hanterar det som kommer tillbaka i body (vårt response) 
                    //re-routa till error sidan annars! 
                });

            }

        });
    }

})