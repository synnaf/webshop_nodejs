const mongoose = require('mongoose')

const schemaAdmin = {
    adminName: {
        type: String,
        // unique: true,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    adminPassword: {
        type: String,
        // unique: true,
        required: true,
        minlength: 2,
        // maxlength: 20,
    },
    date: {
        type: Date,
        default: Date.now,
        lastActiveAt: Date
    },

}

const adminModel = mongoose.model('admin', schemaAdmin)

module.exports = adminModel