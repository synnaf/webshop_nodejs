const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    artist: String,
    vinylRecord: String,
    vinylRecordPrice: Number,
    spotifyId: String,
    tracks: Number, 
    genre: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const Product = mongoose.model("product", schemaProduct)

module.exports = Product