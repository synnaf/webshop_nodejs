"use strict";

var mongoose = require('mongoose');
var Schema = require("mongoose").Schema;

var schemaProduct = new Schema({
    artist: String,
    album: String,
    tracks: String,
    spotifyId: String,
    imgUrl: String,
    genre: [],
    price: Number,
    addedBy: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

var Product = mongoose.model("Product", schemaProduct);

module.exports = Product;