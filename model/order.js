const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
    orderDate: { type: Date },
    ordedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User email"
    }, 
    //en array av produkter, precis som wishlist 
    orderedProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }]
})

//////////////////

/* 
ObjectId to use populate 
ref tells mongoose in which model to look  */ 

/* Det som ska hända är: 
- När man kommer till checkout så visas wishlist och User 
- När man klickar på BESTÄLL så kommer man till order-confirmation
--- då sker en post-request som postar till db 
--- sedan sker en get-request till confirmation-sidan

> det som då fanns i wishlist pushas till listan i orders 
> wishlist töms 
> orders återfinns sedan på User, som kan visas på UserProfile 
alterntivt: 
> orders visas på confirmation-sidan

> beställningen har sparats i collection orders 

*/

//////////////////



const Order = mongoose.model("Order", schemaOrder)

module.exports = Order; 
