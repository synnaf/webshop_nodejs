'use strict';

var express = require('express');
var router = express.Router();
// const Admin = require('../model/admin');
var constant = require('../constant');

router.get(constant.ROUTE.loginAdmin, function (req, res) {
    res.status(200).render(constant.VIEW.loginAdmin);
});

router.get(constant.ROUTE.admin, function (req, res) {
    res.status(200).render(constant.VIEW.admin);
});

module.exports = router;