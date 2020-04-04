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
    wishlist: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }],
    shoppingcart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }, 
        quantity: {
            type: Number,
            default: 1
        }
    }], 
    orders: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Order"
        }
    }]

}); 


// ----------------- SHOPPINGCART ---------------------- // 


schemaUser.methods.addToShoppingcart = function(product) { 
        this.shoppingcart.push({ productId: product._id })
        const filter = this.shoppingcart.filter(function ({
            productId
        }) {
            return !this.has(`${productId}`) && this.add(`${productId}`)
        }, new Set)
        this.shoppingcart = [...filter]
        return this.save();
}


schemaUser.methods.removeFromShoppingcart = function (productId) {
    const currentProducts = this.shoppingcart.filter((product) => {
        return product.productId.toString()
            !==productId.toString()
    })
    this.shoppingcart = currentProducts;
    return this.save();
}

schemaUser.methods.clearShoppingcart = function() {
    this.shoppingcart = [] ;
    return this.save();
};

// -------------- WISHLIST ----------------------------- // 

schemaUser.methods.addToWishlist = function (product) {
    this.wishlist.push({ productId: product._id })
    const filter = this.wishlist.filter(function ({
        productId
    }) {
        return !this.has(`${productId}`) && this.add(`${productId}`)
    }, new Set)
    this.wishlist = [...filter]
    return this.save();
}

schemaUser.methods.removeWishList = function(productId) {
    const currentProducts = this.wishlist.filter((product) => {
        return product.productId.toString()
            !==productId.toString()
    })
    this.wishlist = currentProducts;
    return this.save();
}

// ------------- ORDER ------------- // 

schemaUser.methods.createOrder = function(order) {
    this.orders.push({ orderedByUser: order._id })
    return this.save();
}
  

const userModel = mongoose.model('User', schemaUser);
module.exports = userModel; 
