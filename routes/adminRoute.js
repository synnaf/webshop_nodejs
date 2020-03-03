const express = require('express');
const router = express.Router();
const productModel = require('../model/product');
const serverVariable = require('../serverVariable');
const request = require('request'); // "Request" library
const config = require("../config/config"); 


router.get(serverVariable.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.loginAdmin);
})

router.get(serverVariable.ROUTE.admin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.admin);
})

router.post(serverVariable.ROUTE.admin, (req, res) => {
    new productModel({
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

/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */



const client_id = config.spotify.client_id; // Your client id
const client_secret = config.spotify.client_secret; // Your secret

// your application requests authorization
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

request.post(authOptions, function(error, response, body) {
  
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token || "BQDaqjS9Xly18A6FtcdMnvyOqjCmPBcsnBNj5BpZZpQi0QUDP_0jKaWdKAUoJJlF_VxqnUPvr4x3exwfLg-grLN95JpJ8fKmhJMANveRxxPg30xGdUmsd4QgL_QDyJhQGSZLg5tkpokn";
    var options = {
      url: 'https://api.spotify.com/v1/users/inspector13',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
    });


const SearchArtist = "https://api.spotify.com/v1/search?type=artist&q=beyonce&access_token=" + token; 
console.log("You searched for: " + SearchArtist); 
 
}

});

//skapa variabler för client_id + secret i config
//hämta in dem här så att de kan användas 