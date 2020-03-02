const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    productDescription: String,
    enum: ['Disco', 'Rock'],
    imgUrl: String
})

const productItem = mongoose.model('product', schemaProduct)

module.exports = productItem