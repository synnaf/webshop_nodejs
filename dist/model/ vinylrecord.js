'use strict';

var mongoose = require('mongoose');

var schemaAlbum = new mongoose.Schema({
    artist: String,
    vinylRecordsPrice: Number,
    spotifyId: String,
    // vinylRecordsDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
});

var vinylRecordModel = mongoose.model('vinylrecords', schemaVinylRecords);

module.exports = vinylRecordModel;