const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user"); 
const OrderModel = require("../model/order"); 
const verifyToken = require("./verifyToken"); 
const config = require('../config/config'); 
const stripe = require("stripe")(config.stripe_api.sc_key); 

// ---------------------- HÄMTA CHECKOUT, VISA SHOPPINGCART------------------------- // 

router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    if (verifyToken) {
    const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id }).populate('shoppingcart.productId', {
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
        success_url: 'http://localHost:8080'+ ROUTE.confirmation,
        cancel_url: 'http://localHost:8080/canceled',
    })
    .then( (session)=> {
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo, sessionId: session.id, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })
    });
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserCart: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }
})


// -------- delete shoppingcart item ------------- //

router.get("/delete/:id", verifyToken, async (req,res)=>{

    if(verifyToken) {
        const user = await UserModel.findOne({ _id: req.body.userInfo._id });
        console.log(user)
        user.removeFromShoppingcart(req.params.id)
        res.redirect(ROUTE.checkout)
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
    

    const order = await new OrderModel({ 
        ordedByUser: req.body.userInfo._id, 
        orderedProducts: req.body.userInfo.shoppingcart.map(i => ({ ...i }))
    }).save();

    const customer = await UserModel.findOne({ _id: req.body.userInfo._id })
    console.log(customer + " this is customer in checkout post")
    
    customer.createOrder(order); 

    return res.redirect(ROUTE.confirmation)  
    
})



// --------------- ORDER CONFIRMATION -------------------- // 

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    
    if (verifyToken) {

        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id }).populate('orders.orderedByUser'); 
        console.log(showUserInfo + " this is userinfo from confirmation")

        const showOrderInfo = await OrderModel.findOne({orderedByUser: req.body.userInfo._id}).populate('orderedByUser', { _id: 1, email: 1, firstName: 1, lastName: 1, address: 1 });
    
        const showOrderDetails = await OrderModel.findOne({orderedProducts: req.body.userInfo._id}).populate('orderedProducts', {products: 1 })
        console.log(showOrderInfo + " this is orderinfo from confirmation")
        
        res.status(202).render(VIEW.confirmation, { ROUTE, showOrderInfo, showUserInfo, showOrderDetails, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })

        // customer.clearShoppingcart();

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