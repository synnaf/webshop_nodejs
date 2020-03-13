const express = require('express');
const router = express.Router();
const constant = require('../constant');
const userModel= require("../model/user")
const verifyToken = require("./verifyToken")


    router.get(constant.ROUTE.checkout, async (req, res) => {
    const token=req.cookies.jsonwebtoken 
    console.log(token,"finns på checkout")
    const showUserInfo = await  userModel.findOne()
   
    if(token){
        return verifyToken, res.status(202).render(constant.VIEW.checkout,{showUserInfo})
       
    } else{
       
        return res.status(202).render(constant.VIEW.checkout,{showUserInfo:"empty cart"})
    }

})


module.exports= router ;
