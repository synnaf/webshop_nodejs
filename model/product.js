const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    artist: String,
    vinylRecord: String,
    vinylRecordPrice: Number,
    spotifyId: String,
    vinylRecordDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const products = mongoose.model("product", schemaProduct)

module.exports = products