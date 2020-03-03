const mongoose = require('mongoose')

const schemaAlbum = new mongoose.Schema({
    artist: String,
    vinylRecordsPrice: Number,
    spotifyId: String,
    // vinylRecordsDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const vinylRecordModel = mongoose.model('vinylrecords', schemaVinylRecords)

module.exports = vinylRecordModel