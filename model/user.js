const mongoose = require('mongoose')


const schemaUser = new mongoose.Schema({

    userPassWord: {
        Type: String,
        unique: true,
        require: true,
        minlength: 2,
        maxlength: 20,
    },
    userAddress: {
        Type: String,
        minlength: 2,
        maxlength: 20,
    },
    userMail: {
        Type: String,
        minlength: 2,
        maxlength: 20,
        unique: true,

    },
    userFirstName: {
        Type: String,
        minlength: 2,
        maxlength: 10,
        unique: true,

    },
    userLastName: {
        Type: String,
        minlength: 2,
        maxlength: 10,


    },
    Cart: [String],
    date: {
        type: Date,
        default: Date.now,
        lastActiveAt: Date
    },

})

const userModel = mongoose.model('User', schemaUser)

module.exports = userModel