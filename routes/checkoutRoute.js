const express = require('express');
const router = express.Router();
const { ROUTE, VIEW } = require('../constant');
const UserModel = require("../model/user"); 
const OrderModel = require("../model/order"); 
const ProductModel = require("../model/order");
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
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
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
        res.send("nope")
    }

}); 

// -------- update cartitem --------------- // 

router.get("/update/:id", verifyToken, async (req,res)=>{
    
    const product_ = req.params.id; 
    console.log(product_)

    const user = await UserModel.findOne({ _id: req.body.userInfo._id });
    console.log(user)

    const product = await ProductModel.findOne({ _id: req.params.id });

    // const { productId, quantity, name, price } = req.body;
    // const userId =  await UserModel.findOne({_id: req.body.userInfo._id});//TODO: the logged in user id

    // if( ) {
       
    //     //hämta quantity för produkten
    //     //öka quantity med 1 
    //     //spara och skicka tillbaka till checkout 

    // }

    // if() {
    //     //minus-knappen öär tryckt 
    //     //hämta quantity för produkten
    //     //minska quantity med 1 
    //     //spara och skicka tillbaka till checkout 
    // }

    // //uppdatera shoppingcart med två olika villkor 
    // res.redirect(ROUTE.checkout)
})





// ------------------ POST REQUEST FRÅN CHECKOUT ----------------------------------- // 

router.post(ROUTE.checkout, verifyToken, async (req, res) => {
    
    // //innuti request-body har vi info om vår användare 
    // console.log(req.body.userInfo.email + " req-body")
    // console.log(req.body.userInfo.wishlist.productId  + " req-bodu wishlist")
 
    // //skapar en New Order i db-collection order
    // const order = await new OrderModel({
    //     orderDate: Date.now(), //sätter dagens datum 
    //     ordedByUser: req.body.userInfo, //ska sätta info från användaren, tar enligt ref objectId 
    //     orderedProducts: req.body.userInfo.shoppingcart //hämta info från wishlist, tar enligt ref objectId 
    // });
    // order.save();  

    //redirectar till confirmation
    res.status(200).redirect(ROUTE.confirmation)
    

})



// ------------ En route där vi vill köra metoden för order på user? --------------- // 
// --------------- Detta är det som sker när man trycker på BESTÄLL -------------------- // 

router.get(ROUTE.confirmation, verifyToken, async (req, res) => {
    
    if (verifyToken) {
        const showOrderInfo = await UserModel.findOne({ _id: req.body.userInfo._id }); 
       res.status(202).render(VIEW.confirmation, { ROUTE, showOrderInfo, token: (req.cookies.jsonwebtoken !== undefined) ? true : false })
//         console.log(req.body.userInfo + " this is the active user"); 
//         console.log(req.body.userInfo.wishlist + " this is wishlist")

 //        const showOrderInfo = await UserModel.findOne({ _id: req.body.userInfo._id }).populate('orders.orderId', {orderId: req.body.userInfo._id 
//         //denna rad bidrar till att göra push in i orders på user-modellen
//         const showUserInfo = await UserModel.findOne({ _id: req.body.userInfo._id }).populate('orders.orderId', {
//             orderId: req.body.userInfo._id 
//         }); 

      
//         // //Leta i ordermodel efter ett _id som matchar req.params_id. 
//         // //Populera ordedProducts productId?
//         const userOrder = await OrderModel.findOne({_id: req.params._id}).populate('orderedProducts.productId', {
//             productId: req.body.userInfo.wishlist
//         });
  
//         // //hitta användaren, använd metoden och skicka med order_s och userA 
//         const user = await UserModel.findOne({_id: req.body.userInfo._id }).populate('orders');
//         console.log(user.orders + " this is user orders")
  
//         // //till användaren, lägg till produkten enligt metoden 
//         user.orderProducts(showUserInfo, userOrder);

//         // //skicka användaren till confirmation 
//         return res.redirect(ROUTE.userAccount);

    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du måste logga in för att lägga till produkten i din önskelista!'
            }
        }));
    }
})


module.exports = router;