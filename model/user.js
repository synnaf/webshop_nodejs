const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaUser = new Schema({

    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        minlength: 2,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        minlength: 2
    },
    lastName: {
        type: String,
        minlength: 2
    },
    address: {
        type: String,
        minlength: 2
    },
    resetToken: String,
    expirationToken: Date,
    shoppingcart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product" //det som exporteras i product-model 
        }
    }]
})

schemaUser.methods.addToCart = function (product) {
    this.shoppingcart.push({
        productId: product._id
    })
    //hämtar sitt id från mongoose


    const filter = this.shoppingcart.filter(function ({
        productId
    }) {
        console.log({
            productId
        })

        return !this.has(`${productId}`) && this.add(`${productId}`)

    }, new Set)

    console.log(filter)

    this.shoppingcart = [...filter]

    return this.save();
}


const userModel = mongoose.model('User', schemaUser)
module.exports = userModel