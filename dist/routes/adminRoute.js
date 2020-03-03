'use strict';

var express = require('express');
var router = express.Router();
// const Admin = require('../model/admin');
var serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.loginAdmin, function (req, res) {
    res.status(200).render(serverVariable.VIEW.loginAdmin);
});

router.get(serverVariable.ROUTE.admin, function (req, res) {
    res.status(200).render(serverVariable.VIEW.admin);
});

module.exports = router;