const express = require('express');
const router = express.Router();
// const User = require('../model/user');
const constant = require('../constant');

router.get(constant.ROUTE.loginUser, (req, res) => {
    res.status(200).render(constant.VIEW.loginUser);
})

router.get(constant.ROUTE.userAccount, (req, res) => {
    res.status(200).render(constant.VIEW.userAccount);
})

router.get(constant.ROUTE.checkout, (req, res) => {
    res.status(200).render(constant.VIEW.checkout);
})

router.get(constant.ROUTE.confirmation, (req, res) => {
    res.status(200).render(constant.VIEW.confirmation);
})

module.exports = router;