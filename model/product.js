const mongoose = require('mongoose')

const schemaVinylRecords = new mongoose.Schema({
    artist: String,
    vinylRecord: String,
    vinylRecordPrice: Number,
    spotifyId: String,
    vinylRecordDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const productModel = mongoose.model("product", schemaVinylRecords)

module.exports = productModel