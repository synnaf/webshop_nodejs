const express = require('express');
const router = express.Router();
const constant = require('../constant');
const userModel= require("../model/user")
const verifyToken = require("./verifyToken")


router.get(constant.ROUTE.checkout, verifyToken, async (req, res) => {
    
    // const token = req.cookies.jsonwebtoken 
    // const user = await UserInfoModel.findOne({_id: req.body.userInfo._id});
   
    if(verifyToken){
        const showUserInfo = await userModel.findOne({_id: req.body.userInfo._id })
        res.status(202).render(constant.VIEW.checkout,{showUserInfo: showUserInfo.wishlist})

    } else{

        return res.status(202).render(constant.VIEW.checkout,{showUserInfo:"empty cart"})
    }

})


module.exports= router ;
