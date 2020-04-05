const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const schemaOrder = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderDate: { type: Date, default: Date.now },
    orderItems: Array,
})


const Order = mongoose.model("Order", schemaOrder)

module.exports = Order