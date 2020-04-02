const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
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


