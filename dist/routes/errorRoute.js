'use strict';

var express = require('express');
var router = express.Router();
var constant = require('../constant');

router.get(constant.ROUTE.error, function (req, res) {
    res.status(200).render(constant.VIEW.error, { errmsg: '404' });
});

module.exports = router;