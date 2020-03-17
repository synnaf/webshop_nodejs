const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require("crypto"); 
const UserInfoModel = require('../model/user');
const config = require('../config/config');
const constant = require('../constant');
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken"); 
const nodemailer = require("nodemailer"); 
const sendgridTransport = require("nodemailer-sendgrid-transport"); 
const transport = nodemailer.createTransport(sendgridTransport({
    auth: { api_key: config.mailkey }
}))

router.get(constant.ROUTE.createUser, (req, res) => {
    res.status(200).render(constant.VIEW.createUser);

})
router.post(constant.ROUTE.createUser, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    if ( req.body.adminpass == config.adminPassword) {
        await new UserInfoModel({
            isAdmin: true,
            email: req.body.email,
            password: hashPassword,
            address: "Admin",
            firstName: "Admin",
            lastName: "Admin",
        }).save()
    }
    else {
        await new UserInfoModel({
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }).save(); 

    // const userEmail = await UserInfoModel.findOne({
    //     email: req.body.email
    // });
    // //skicka mail till användaren kommer ske här 
    // // await transport.sendMail({
    // //     to: userEmail.email,
    // //     from: "<no-reply>Webshop-NMFVM", 
    // //     subject: "Välkommen!",
    // //     html: "<h1>Välkommen " + userEmail.email + "</h1>"
    // // });

    const userInfo = await UserInfoModel.findOne({
        email: req.body.email
    });
    if (!userInfo) return res.render("errors", {
        errmsg: 'Fel email!'
    });
    const validUser = await bcrypt.compare(req.body.password, userInfo.password);
        if (!validUser) return res.render("errors", {
            errmsg: 'Fel lösenord!'
        });
        jwt.sign({ userInfo }, 'secretPriveteKey', (err, token) => {
            if (err) return res.render('errors', {
                errmsg: 'token funkar inte'
            });
            if (token) {
                const cookie = req.cookies.jsonwebtoken;
                if (!cookie) {
                    res.cookie('jsonwebtoken', token, {
                        maxAge: 400000,
                        httpOnly: true
                    })
                }
            }
        res.redirect(constant.VIEW.userAccount);
        })
    }

});   

//------------------------//

router.get(constant.ROUTE.loginUser, (req, res) => {
    res.status(200).render(constant.VIEW.loginUser, {
        constant
    });
})

router.get(constant.ROUTE.login, (req, res) => {
    res.status(200).render(constant.VIEW.login, {
        constant
    });
})

router.post(constant.ROUTE.login, async (req, res) => {
    const userInfo = await UserInfoModel.findOne({
        email: req.body.email
    });

    console.log(req.body.email)
    if (!userInfo) return res.render("errors", {
        errmsg: 'Fel email!'
    });
    console.log(req.body.password)
    
    const validUser = await bcrypt.compare(req.body.password, userInfo.password);
    if (!validUser) return res.render("errors", {
        errmsg: 'Fel lösenord!'
    });
    jwt.sign({
        userInfo
    }, 'secretPriveteKey', (err, token) => {
        if (err) return res.render('errors', {
            errmsg: 'token funkar inte'
        });

        console.log("token", token)
        if (token) {
            const cookie = req.cookies.jsonwebtoken;
            if (!cookie) {
                console.log('cookie2', req.cookies)
                res.cookie('jsonwebtoken', token, {
                    maxAge: 400000,
                    httpOnly: true
                })
            }
        }

        if (userInfo.isAdmin) {
            res.redirect(constant.ROUTE.admin);
        }
        res.redirect(constant.VIEW.userAccount);
    })
    
}); 

router.get(constant.ROUTE.userAccount,verifyToken, async (req, res) => {
    // const newUser = jwt.decode(req.cookies.jsonwebtoken).signedUpUser; 
    const loggedIn = jwt.decode(req.cookies.jsonwebtoken).userInfo;
    res.status(200).render(constant.VIEW.userAccount, {
        constant,
        loggedIn, 
    });
})

router.post(constant.ROUTE.userAccount, async (req, res) => {
    //showUserInfo kommer sen att hämta användare via jwt istället för att bara hämta en
    const loggedIn = jwt.decode(req.cookies.jsonwebtoken).userInfo;

    if (await bcrypt.compare(req.body.currentpassword, loggedIn.password)) {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(req.body.newpassword, salt)

        await UserInfoModel.updateOne({
            email: loggedIn.email
        }, {
            $set: {
                password: newHashPassword
            }
        }, {
            runValidators: true
        }, (error, success) => {
            if (error) {
                res.send(error._message);
            } else {
                res.redirect(constant.ROUTE.userAccount + "?success");
            }
        });
    } else {
        res.redirect(constant.ROUTE.userAccount + "?failure");
    }
})


router.get(constant.ROUTE.confirmation, (req, res) => {
    res.status(200).render(constant.VIEW.confirmation);
})



//-------------- Fanny lägger in routes för att reset password ------------ // 

router.get(constant.ROUTE.resetpassword, (req, res) => {
    res.status(200).render(constant.VIEW.resetpassword, {constant});
})

router.post(constant.ROUTE.resetpassword, async (req, res) => {
    crypto.randomBytes(32, async (error, token) => {
        if (error) return res.redirect(constant.VIEW.userAccount); 
        const resetToken = token.toString("hex");
        const user = UserInfoModel.findOne({ email: req.body.resetMail })
            .then(user => {
                if (!user) return res.redirect(constant.VIEW.userAccount)
                user.resetToken = resetToken
                user.tokenExpiration = Date.now() + 1000000
                return user.save(); 
            })
            .then( ()=> {
                transport.sendMail({
                    to: user.resetMail,
                    from: "<no-reply>Byt lösenord", 
                    subject: "Ändra ditt lösenord!",
                    html: `http://localhost:8003/reset/${resetToken} <h2>Klicka på länken för att ändra ditt lösenord!<h2>`
                });   
            })  
        return res.redirect(constant.VIEW.loginUser)
    })
})


router.get(constant.ROUTE.resetpasswordToken, async (req, res) => { 
    const token = req.params.token;
    const user = await UserInfoModel.findOne({ resetToken: token, tokenExpiration: {$gt: Date.now()}  }); 
    res.render(constant.VIEW.resetform, {user, constant}) 
})

router.post(constant.ROUTE.resetpasswordToken, async (req, res)=> {
   const user = await UserInfoModel.findOne({ resetToken: req.body.token }) 
   if(user) {
       const hashPassword = await bcrypt.hash(req.body.password, 10); 
       user.password = hashPassword; 
       user.resetToken = undefined;
       user.tokenExpiration = undefined; 
       await user.save(); 
   }
   res.redirect(constant.VIEW.loginUser); 
})


module.exports = router;