// schema för en produkt
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imgUrl: String
})

const productItem = mongoose.model('product', schema)

module.exports = productItem