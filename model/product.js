const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    artist: String,
    album: String,
    tracks: String,
    spotifyId: String,
    imgUrl: String,
    genre: [],
    price: Number,
})

const Product = mongoose.model("product", schemaProduct)

module.exports = Product