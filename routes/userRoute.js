const express = require('express');
const router = express.Router();
// const User = require('../model/user');
const serverVariable = require('../serverVariable');

router.get(serverVariable.ROUTE.loginUser, (req, res) => {
    res.status(200).render(serverVariable.VIEW.loginUser);
})

router.get(serverVariable.ROUTE.userAccount, (req, res) => {
    res.status(200).render(serverVariable.VIEW.userAccount);
})

router.get(serverVariable.ROUTE.checkout, (req, res) => {
    res.status(200).render(serverVariable.VIEW.checkout);
})

router.get(serverVariable.ROUTE.confirmation, (req, res) => {
    res.status(200).render(serverVariable.VIEW.confirmation);
})

module.exports = router;