const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
    //borde detta vara en array? en array där varje objekt består ab date,products, user? 
    orderDate: { type: Date },
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


