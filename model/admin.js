const mongoose = require('mongoose')


const schemaAdmin = new mongoose.Schema({
    adminName: {
        Type: String,
        unique: true,
        require: true,
        minlength: 2,
        maxlength: 20,
    },
    adminPassword: {
        Type: String,
        unique: true,
        require: true,
        minlength: 2,
        maxlength: 20,
    },
    date: {
        type: Date,
        default: Date.now,
        lastActiveAt: Date
    },

})

const adminModel = mongoose.model('admin', schemaAdmin)

module.exports = adminModel