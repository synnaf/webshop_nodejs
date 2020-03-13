const express = require('express');
const router = express.Router();
const constant = require('../constant');
const userModel= require("../model/user")

 //href="token"
 //if börjar här
    router.get(constant.ROUTE.checkout, async (req, res) => {
       
     // hämtar token från  verifytoken;   hämtar token från  måste recuired
    
    const token=req.cookies.jsonwebtoken 
    console.log(token,"finns på checkout")
    const showUserInfo = await  userModel.findOne()
   
  
    if(token){
        return res.status(202).render(constant.VIEW.checkout,{showUserInfo})
       
    } else{
       
        return res.status(202).render(constant.VIEW.checkout,{showUserInfo:"empty cart"})
    }

})


module.exports= router ;
