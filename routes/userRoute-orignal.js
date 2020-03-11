const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken')
const UserInfoModel = require('../model/user');
const constant = require('../constant');
const config = require('../config/config');





router.get(constant.ROUTE.createUser, (req, res) => {
    res.status(200).render(constant.VIEW.createUser);

})
router.post(constant.ROUTE.createUser, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await new UserInfoModel({
        email: req.body.email,
        password: hashPassword,
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }).save()
    res.redirect(constant.VIEW.index)

})

router.get(constant.ROUTE.loginUser, (req, res) => {
    res.status(200).render(constant.VIEW.loginUser);
})

router.post(constant.ROUTE.loginUser, async (req, res) => {
    const showUserInfo = await UserInfoModel.findOne({
        email: req.body.email
    });

    if (!showUserInfo) return res.render('errors', {
        errmsg: 'Fel email!'
    });
    console.log(showUserInfo.password)
    const validUser = await bcrypt.compare(req.body.password, showUserInfo.password);
    console.log(validUser);
    if (!validUser) return res.render('errors', {
        errmsg: 'Fel lösenord!'
    });

    jwt.sign({ // vad är sign funktion som playlod är använadre info allså userInfo
        showUserInfo // "secretPriveteKey" behöver gömas i config filen
    }, "secretPriveteKey", (err, token) => { // nyckel "secretkey" ger exra skydd den har en calback err och token // här skapas en token med använadre info //om inte funkar skickar err annars skickar token
        if (err) return res.render('errors', { // token info  sparas i brower och i front end 
            errmsg: 'token funkar inte'
        });

        console.log("token", token)
        if (token) {
            const cookie = req.cookies.jsonwebtoken; // kollar om användare har loggat in// viktigt att står jwt på rad 55
            //console.log('cookie1', req.cookies)
            if (!cookie) { // kollar om token finns så sparas i cookis

                res.cookie('jsonwebtoken', token, { // token spara jwt
                    maxAge: 400000, // talar om hur länge  info den ska sparas
                    httpOnly: true // vilken produkoll den användre
                })

            }
            res.render(constant.VIEW.userAccount, {
                showUserInfo
            })
            /*  res.render(constant.VIEW.userAccount, {
                 showUserInfo
             }); */
        }
    })

    //  if (validUser) return res.redirect(constant.VIEW.userAccount);

})

//router.get(constant.ROUTE.userAccount, verifyToken, async (req, res) => {
// const showUserInfo = await UserInfoModel.findOne();
// console.log(showUserInfo)
// res.status(200).render(constant.VIEW.userAccount, {
//     showUserInfo,
// });

//})

router.post(constant.ROUTE.userAccount, async (req, res) => {
    //showUserInfo kommer sen att hämta användare via jwt istället för att bara hämta en
    const showUserInfo = await UserInfoModel.findOne();

    if (await bcrypt.compare(req.body.currentpassword, showUserInfo.password)) {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(req.body.newpassword, salt)
        await UserInfoModel.updateOne({
            email: showUserInfo.email
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

module.exports = router;