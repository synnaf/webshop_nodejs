
const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imgUrl: String
})

const productItem = mongoose.model('product', schemaProduct)

module.exports = productItem