const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user")
const verifyToken = require("./verifyToken")


router.get(ROUTE.checkout, verifyToken, async (req, res) => {

    // const token = req.cookies.jsonwebtoken 
    // const user = await UserInfoModel.findOne({_id: req.body.userInfo._id});

    if (verifyToken) {
        console.log(req.body)
        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo: showUserInfo.shoppingcart, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })

    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false 
        })
    }

})


module.exports = router;
