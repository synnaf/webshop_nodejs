'use strict';

// schema för en produkt
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imgUrl: String
});

var productItem = mongoose.model('product', schema);

module.exports = productItem;