const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
    orderDate: { type: Date },

//     //häntar user från User-model
//     ordedByUser: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }, 

//     //en array av produkter, precis som wishlist 
//     //häntar id från Product-model
//     orderedProducts: [{
//         productId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product"
//         }
//     }]
// })

    orderedProducts: [
        {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
        }
    ],
    ordedByUser: {
        email: {
        type: String,
        required: true
        },
        userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
        }
    }
}); 

const Order = mongoose.model("Order", schemaOrder)

module.exports = Order; 


