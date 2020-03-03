const express = require('express');
const router = express.Router();
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.error, (req, res) => {
    res.status(404).render(serverVariable.VIEW.error, {errmsg: '404'});
})

module.exports = router;