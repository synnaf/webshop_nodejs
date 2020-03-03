'use strict';

var express = require('express');
var router = express.Router();
var serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.error, function (req, res) {
    res.status(200).render(serverVariable.VIEW.error, { errmsg: '404' });
});

module.exports = router;