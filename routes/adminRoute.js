const express = require('express');
const router = express.Router();
// const Admin = require('../model/admin');
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.loginAdmin);
})

router.get(serverVariable.ROUTE.admin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.admin);
})

module.exports = router;