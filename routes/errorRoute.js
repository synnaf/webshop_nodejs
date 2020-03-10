const express = require('express');
const router = express.Router();
const constant = require('../constant');

router.get(constant.ROUTE.error, (req, res) => {
    res.status(404).render(constant.VIEW.error, {errmsg: '404. Sidan finns inte!'});
})

module.exports = router;