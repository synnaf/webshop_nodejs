const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user")
const verifyToken = require("./verifyToken")


router.get(ROUTE.checkout, verifyToken, async (req, res) => {

    // const token = req.cookies.jsonwebtoken 
    // const user = await UserInfoModel.findOne({_id: req.body.userInfo._id});

    if (verifyToken) {
        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
            .populate('wishlist.productId', {
                artist: 1,
                album: 1,
                price: 1
            })
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })
        console.log('ALBUM ÄR', showUserInfo.wishlist.album)
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }

})


module.exports = router;
