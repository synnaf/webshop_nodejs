const mongoose = require('mongoose')

const schemaProduct = new mongoose.Schema({
    artist: String,
    album: String,
    tracks: String,
    spotifyId: String,
    imgUrl: String,
    genre: [],
    price: Number,
    addedBy: String, 
    user: {
        //ett objekt id från mongoose 
        type: mongoose.Schema.Types.ObjectId,
        //referens från en user 
        ref: "User" 
    }
})

const Product = mongoose.model("Product", schemaProduct)

module.exports = Product