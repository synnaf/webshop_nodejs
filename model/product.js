const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    artist: String,
    albumPrice: Number,
    spotifyId: String,
    productDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const productItem = mongoose.model('product', schemaProduct)

module.exports = productItem