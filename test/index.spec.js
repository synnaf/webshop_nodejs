const expect = require('chai').expect
const app = require("../index")
const {
    fetchSpotifyApiData,
} = require('../routes/adminRoute');
const {
    oneProduct
} = require('../routes/productRoute');

describe('Testing functions for Vinylshop webshop', () => {

    describe('Does app exist', () => {
        it('Should respond to app', () => {

            expect(app).to.exist
        })
    })

    describe('Function fetchSpotifyData to return data from Spotify API', () => {

        it('Should return a JSON object', () => {
            const artistSearchValue = 'beyonce';
            const albumSearchValue = 'lemonade';

            const spotifyResponse = fetchSpotifyApiData(artistSearchValue, albumSearchValue)
            expect(spotifyResponse).to.equal({})
        });

    })
})