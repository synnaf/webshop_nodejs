'use strict';

var express = require('express');
var router = express.Router();
// const User = require('../model/user');
var serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.loginUser, function (req, res) {
    res.status(200).render(serverVariable.VIEW.loginUser);
});

router.get(serverVariable.ROUTE.userAccount, function (req, res) {
    res.status(200).render(serverVariable.VIEW.userAccount);
});

router.get(serverVariable.ROUTE.checkout, function (req, res) {
    res.status(200).render(serverVariable.VIEW.checkout);
});

router.get(serverVariable.ROUTE.confirmation, function (req, res) {
    res.status(200).render(serverVariable.VIEW.confirmation);
});

module.exports = router;