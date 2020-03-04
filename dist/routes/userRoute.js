'use strict';

var express = require('express');
var router = express.Router();
// const User = require('../model/user');
var constant = require('../constant');

router.get(constant.ROUTE.loginUser, function (req, res) {
    res.status(200).render(constant.VIEW.loginUser);
});

router.get(constant.ROUTE.userAccount, function (req, res) {
    res.status(200).render(constant.VIEW.userAccount);
});

router.get(constant.ROUTE.checkout, function (req, res) {
    res.status(200).render(constant.VIEW.checkout);
});

router.get(constant.ROUTE.confirmation, function (req, res) {
    res.status(200).render(constant.VIEW.confirmation);
});

module.exports = router;