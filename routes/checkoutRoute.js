const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const userModel = require("../model/user")
const verifyToken = require("./verifyToken")


router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    const token = req.cookies.jsonwebtoken;  

    if (token) {
        const showUserInfo = await userModel.findOne({ _id: req.body.userInfo._id })
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo: showUserInfo.shoppingcart })
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false 
        })
    }

})


module.exports = router;
