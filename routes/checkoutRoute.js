const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user"); 
const verifyToken = require("./verifyToken"); 
const config = require("../config/config"); 
const stripe = require("stripe")(config.stripe_api.sc_key); 

// ---------------------- HÄMTA CHECKOUT, VISA SHOPPINGCART------------------------- // 

router.get(ROUTE.checkout, verifyToken, async (req, res) => {


    if (verifyToken) {

        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
        .populate('shoppingcart.productId', {
            artist: 1,
            album: 1,
            price: 1,
            quantity: 1
        }); 
            return stripe.checkout.sessions.create({
                payment_method_types: ["card"], 
                line_items: showUserInfo.shoppingcart.map((products)=> {
                    return {
                        name: products.productId.album, 
                        amount: products.productId.price*10, 
                        quantity: 1, 
                        currency: "eur" 
                    }
                }), 
                success_url: 'http://https://vinylfanny.herokuapp.com/'+ ROUTE.confirmation,
                cancel_url: 'http://https://vinylfanny.herokuapp.com/',
            })
            .then( (session)=> {
                res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo, sessionId: session.id, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })
            });
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserCart: "Du måste vara inloggad för att handla!",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }
})

// -------- delete shoppingcart item ------------- //

router.get("/delete/:id", verifyToken, async (req,res)=>{

    if(verifyToken) {
        const user = await UserModel.findOne({ _id: req.body.userInfo._id });
        user.removeFromShoppingcart(req.params.id)
        return res.redirect(ROUTE.checkout)
    } else { 
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserCart: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }

}); 

// ------------------ POST REQUEST FRÅN CHECKOUT ----------------------------------- // 

router.post(ROUTE.checkout, verifyToken, async (req, res) => {

    const customer = await UserModel.findOne({ _id: req.body.userInfo._id })
    customer.createOrder(customer); 


    return res.redirect(ROUTE.confirmation)  
    
})



// --------------- ORDER CONFIRMATION -------------------- // 

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    
    if (verifyToken) {

        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id });
        showUserInfo.clearShoppingcart(); 
        res.status(202).render(VIEW.confirmation, { ROUTE, showUserInfo, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })

    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du måste logga in för att handla!'
            }
        }));
    }
})


module.exports = router;