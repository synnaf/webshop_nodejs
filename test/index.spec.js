const expect = require('chai').expect
const {
    app,
    PORT
} = require('../src/server');
const {
    fetchSpotifyApiData
} = require('../routes/adminRoute');

describe('Testing functions for Vinylshop webshop', () => {
    describe('Function fetchSpotifyData to return data from Spotify API', () => {

        it('Should return a JSON object', () => {
            const artistSearchValue = 'beyonce';
            const albumSearchValue = 'lemonade';

            const spotifyResponse = fetchSpotifyApiData(artistSearchValue, albumSearchValue)
            expect(spotifyResponse).to.equal([{}])
        });
    })
})