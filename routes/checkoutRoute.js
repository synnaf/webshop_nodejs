const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user")
const OrderModel = require("../model/order")
const verifyToken = require("./verifyToken")
const config = require('../config/config');
const stripe = require("stripe")(config.stripe_api.sc_key); 

// ------------------ CUSTOMER CHECKOUT  ----------------------------------- // 

router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    if (verifyToken) {
        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
            .populate('shoppingcart.productId', {
                artist: 1,
                album: 1,
                price: 1,
            })
        return res.status(202).render(VIEW.checkout, {
            ROUTE, showUserInfo,
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }
})

router.post(ROUTE.checkout, verifyToken, async (req, res) => {

    const customerOrder = await UserModel.findOne({ _id: req.body.userInfo._id })

    const Order = await new OrderModel({
        customerId: req.body.userInfo._id,
        orderItems: Array.from(customerOrder.shoppingcart)
    }).save();

    res.cookie('order', Order._id)
 
    const customer = await UserModel.findOne({ _id: req.body.userInfo._id })
    customer.createOrder(Order)

    return res.redirect(ROUTE.confirmation);
})

// --------------- ORDER CONFIRMATION -------------------- // 

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    
    const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
        .populate('orders.orderId').populate("shoppingcart.productId")

    const showOrderInfo = await OrderModel.findOne({ _id: req.cookies.order })
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
        success_url: 'http://localHost:8080'+ ROUTE.paymentConf, 
        cancel_url: 'http://localHost:8080' + ROUTE.error
    })
    .then((session) => {
        res.render(VIEW.confirmation, {
            sessionId: session.id,
            showUserInfo,
            showOrderInfo,
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        });
    })
})

// ------- PAYMENT CONFIRMATION ---------------- // 

router.get(ROUTE.paymentConf, verifyToken, async (req, res) => {
    if (verifyToken) {
        const customer = await UserModel.findOne({
            _id: req.body.userInfo._id
        }).updateOne({ shoppingcart: [] })
        const order = await OrderModel.findOne({
            _id: req.cookies.order
        }).populate('customerId', { _id: 1, email: 1, firstName: 1, lastName: 1, address: 1 });

        return res.clearCookie("order").render(VIEW.paymentConf, {
            ROUTE,
            customer,
            order,
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })

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