'use strict';

var mongoose = require('mongoose');

var schemaAdmin = new mongoose.Schema({
    adminName: {
        Type: String,
        unique: true,
        require: true,
        minlength: 2,
        maxlength: 20
    },
    adminPassWord: {
        Type: String,
        unique: true,
        require: true,
        minlength: 2,
        maxlength: 20
    },
    date: {
        type: Date,
        default: Date.now,
        lastActiveAt: Date
    }

});

var adminModel = mongoose.model('admin', schemaAdmin);

module.exports = adminModel;