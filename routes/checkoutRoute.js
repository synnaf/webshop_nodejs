const express = require('express');
const router = express.Router();
const { ROUTE, VIEW, PRODUCT } = require('../constant');
const userModel = require("../model/user")
const verifyToken = require("./verifyToken")


router.get(ROUTE.checkout, verifyToken, async (req, res) => {

    // const token = req.cookies.jsonwebtoken 
    // const user = await UserInfoModel.findOne({_id: req.body.userInfo._id});

    if (verifyToken) {
        const showUserInfo = await userModel.findOne({ _id: req.body.userInfo._id })
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo: showUserInfo.wishlist })

    } else {

        return res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo: "empty cart" })
    }

})


module.exports = router;
