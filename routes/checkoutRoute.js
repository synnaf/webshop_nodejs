const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user"); 
const OrderModel = require("../model/order"); 
const ProductModel = require("../model/order");
const verifyToken = require("./verifyToken"); 

// ---------------------- HÄMTA CHECKOUT, VISA WISHLIST ------------------------- // 

router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    if (verifyToken) {
        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id })
            .populate('wishlist.productId', {
                artist: 1,
                album: 1,
                price: 1
            })
        res.status(202).render(VIEW.checkout, { ROUTE, showUserInfo, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })
    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }
})

// ------------------ POST REQUEST FRÅN CHECKOUT ----------------------------------- // 

router.post(ROUTE.checkout, verifyToken, async (req, res) => {
    
    //innuti request-body har vi info om vår användare 
    console.log(req.body.userInfo.email + " req-body")
    console.log(req.body.userInfo.wishlist.productId  + " req-bodu wishlist")
 
    //skapar en New Order i db-collection order
    const order = await new OrderModel({

        orderDate: Date.now(), //sätter dagens datum 
        ordedByUser: req.body.userInfo, //ska sätta info från användaren, tar enligt ref objectId 
        orderedProducts: req.body.userInfo.wishlist //hämta info från wishlist, tar enligt ref objectId 

    });
    order.save();  

    //redirectar till confirmation
    res.redirect(ROUTE.confirmation); 
})





// ------------ En route där vi vill köra metoden för order på user? --------------- // 
// --------------- Detta är det som sker när man trycker på BESTÄLL -------------------- // 

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    
    if (verifyToken) {

        const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id }).populate('orders.orderId'); 
        console.log(showUserInfo + " trying to find user")

        //hitta produkten
        const orders = await OrderModel.findOne({_id: req.params._id}).populate('ordedProduct.productId');
        const userA = await OrderModel.findOne({_id: req.params._id}).populate('ordedByUser');
        //hitta användaren 
        const user = await UserModel.findOne({_id: req.body.userInfo._id });
        
        //till användaren, lägg till produkten enligt metoden 
        user.orderProducts(orders, userA);

        //skicka användaren till confirmation 
        return res.redirect(ROUTE.userAccount);

    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du måste logga in för att lägga till produkten i din önskelista!'
            }
        }));
    }
})


// när man kommer till checkout populeras wishlist 
// när man kommer till confirmation populeras order på User 

//när man trycker på beställ så sparas beställningen till Order




module.exports = router;