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
    shoppingcart: {
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                }, 
                quantity: { type: Number, required: true }    
            }
        ]
    }
}); 


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

schemaUser.methods.removeWishList = function (productId) {
    const currentProducts = this.wishlist.filter((product) => {
        return product.productId.toString()
            !==productId.toString()
    })
    this.wishlist = currentProducts;
    return this.save();
}

// METOD FÖR ATT TÖMMA WISHLIST?  
schemaUser.methods.clearWishlist = function() {
    this.wishlist = { productId: [] };
    return this.save();
};


// ----------------- SHOPPINGCART ---------------------- // 


// METOD FÖR ATT LÄGGA PRODUKTER I CART 
schemaUser.methods.addToShoppingcart = function(productId) {
        const cartProductIndex = this.shoppingcart.products.findIndex(cp => {
            return cp.productId.toString() === product._id.toString(); 
        }); 

        let newQuantity = 1; 
        const updatedCartProducts = [...this.shoppingcart.products]; 

        if(cartProductIndex > 0) {
            newQuantity = this.shoppingcart.products[cartProductIndex].quantity + 1; 
            updatedCartProducts[cartProductIndex].quantity = newQuantity; 
        } else {
            updatedCartProducts.push({
                productId: product._id,
                quantity: newQuantity
            }); 
        }
        const updatedCart = { produtcs: updatedCartProducts}; 
        this.shoppingcart = updatedCart; 
        return this.save(); 
}

// METOD FÖR ATT TA BORT FRÅN CART 
schemaUser.methods.removeFromShoppingcart = function (productId) {
    const updatedCartProducts = this.shoppingcart.products.filter(product => {
        return product.productId.toString() !== productId.toString();
    });
    this.shoppingcart.products = updatedCartProducts;
    return this.save(); 
}

// METOD FÖR ATT TÖMMA CART 
schemaUser.methods.clearCart = function() {
    this.shoppingcart = { products: [] };
    return this.save();
};
  



// schemaUser.methods.orderProducts = function (showUserInfo, userOrder) {
//     //orders.orderId = ges ett Id utifrån Order-model
//     //products kommer tillbaka som null, 
//     //products hämtas från checkout route, 
//     console.log(showUserInfo + " this is showUserinfo")
//     console.log(userOrder + " this is userorder")
//     this.orders.push({ orderId: showUserInfo, orderedProducts: userOrder })
//     const filter = this.orders.filter( function( {orderId, orderedProducts} ) {
//         return !this.has(`${orderId, orderedProducts}`) && this.add(`${orderId, orderedProducts}`)
//     }, new Set)
//     this.orders = [...filter]
//     //sparar till orders-array 
//     return this.save();
// }



const userModel = mongoose.model('User', schemaUser)

module.exports = userModel
