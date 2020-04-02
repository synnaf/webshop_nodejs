const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const UserInfoModel = require('../model/user');
const ProductModel = require("../model/product");
const config = require('../config/config');
const {ROUTE,VIEW} = require('../constant');
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const url = require("url");
const transport = nodemailer.createTransport(sendgridTransport({
    auth: {api_key: config.mailkey.mailkey}
}))

router.get(ROUTE.createUser, (req, res) => {
    res.status(200).render(VIEW.createUser, {
        ROUTE,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });

})
router.post(ROUTE.createUser, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    if (req.body.adminpass == config.admin.adminPassword) {
        await new UserInfoModel({
            isAdmin: true,
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }).save();
    } else {
        try {
            await new UserInfoModel({
                email: req.body.email,
                password: hashPassword,
                address: req.body.address,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }).save();
        } catch (error) {
            res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: 'emailet-adressen är upptagen,försök igen! :)'
                }
            }));
        }
    }
        const userInfo = await UserInfoModel.findOne({
            email: req.body.email
        });
        if (!userInfo) return res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Fel email!'
            }
        }));
        const validUser = await bcrypt.compare(req.body.password, userInfo.password);
        if (!validUser) return res.render("errors", {
            errmsg: 'Fel lösenord!',
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        });
        const tokenSignature = userInfo.isAdmin ? config.tokenkey.adminjwt : config.tokenkey.userjwt;
        jwt.sign({
            userInfo
        }, tokenSignature, (err, token) => {
            if (err) return res.render('errors', {
                errmsg: 'token funkar inte',
                token: (req.cookies.jsonwebtoken !== undefined) ? true : false
            });
            if (token) {
                const cookie = req.cookies.jsonwebtoken;
                if (!cookie) {
                    res.cookie('jsonwebtoken', token, {
                        maxAge: 3500000,
                        httpOnly: true
                    })
                }
                if (tokenSignature == config.tokenkey.adminjwt) return res.redirect(VIEW.admin);
                if (tokenSignature == config.tokenkey.userjwt) return res.redirect(VIEW.userAccount);
            }
        })
});

router.get(ROUTE.login, async (req, res) => {
    res.status(200).render(VIEW.login, {
        ROUTE,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

router.post(ROUTE.login, async (req, res) => {
    const userInfo = await UserInfoModel.findOne({
        email: req.body.email
    });
    if (!userInfo) return res.redirect(url.format({
        pathname: ROUTE.error,
        query: {
            errmsg: 'Fel email!'
        }
    }));

    const validUser = await bcrypt.compare(req.body.password, userInfo.password);
    if (!validUser) return res.redirect(url.format({
        pathname: ROUTE.error,
        query: {
            errmsg: 'Fel lösenord!'
        }
    }));
    else {
        const tokenSignature = userInfo.isAdmin ? config.tokenkey.adminjwt : config.tokenkey.userjwt;
        jwt.sign({
            userInfo
        }, tokenSignature, (err, token) => {
            if (err) return res.redirect(url.format({
                pathname: ROUTE.error,
                query: {
                    errmsg: 'Token fungerar ej!'
                }
            }));
            if (token) {
                const cookie = req.cookies.jsonwebtoken;
                if (!cookie) {
                    res.cookie('jsonwebtoken', token, {
                        maxAge: 3500000,
                        httpOnly: true
                    })
                }
                if (userInfo.isAdmin) {
                    res.redirect(ROUTE.admin);
                } else {
                    res.redirect(ROUTE.userAccount);
                }
            }
        })
    }
});

router.get(ROUTE.userAccount, verifyToken, async (req, res) => {
    const loggedIn = jwt.decode(req.cookies.jsonwebtoken).userInfo;
    const user = await UserInfoModel.findOne({
        _id: req.body.userInfo._id
    }).populate('wishlist.productId', {
        artist: 1,
        album: 1,
        price: 1
    })

    res.status(200).render(VIEW.userAccount, {
        ROUTE,
        loggedIn,
        user,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false,
        passwordChanged: {
            exists: req.query.passwordChanged ? true : false,
            value: (req.query.passwordChanged == 'true') ? true : false
        }
    });
})

router.post(ROUTE.userAccount, async (req, res) => {
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
                res.redirect(url.format({
                    pathname: ROUTE.error,
                    query: {
                        errmsg: error._message
                    }
                }));
            } else {
                res.redirect(url.format({
                    pathname: ROUTE.userAccount,
                    query: {
                        passwordChanged: "true"
                    }
                }));
            }
        });
    } else {
        res.redirect(url.format({
            pathname: ROUTE.userAccount,
            query: {
                passwordChanged: "false"
            }
        }));
    }
})

router.get(ROUTE.wishlistId, verifyToken, async (req, res) => {
    if (verifyToken) {
        const product = await ProductModel.findOne({
            _id: req.params.id
        });
        const user = await UserInfoModel.findOne({
            _id: req.body.userInfo._id
        });
        user.addToWishlist(product);
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

router.get(ROUTE.wishlistRemoveId, verifyToken, async (req, res) => {
    const user = await UserInfoModel.findOne({
        _id: req.body.userInfo._id
    });
    user.removeWishList(req.params.id)
    res.redirect(ROUTE.userAccount);
})


//---------------- add to shoppingcart KÖPKNAPP ----------------- // 

router.get("/shoppingcart/:id", verifyToken, async (req, res) => {
    if (verifyToken) {
        const product = await ProductModel.findOne({
            _id: req.params.id
        });
        const user = await UserInfoModel.findOne({
            _id: req.body.userInfo._id
        });
        user.addToShoppingcart(product);
        return res.redirect(ROUTE.userAccount);
    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du måste logga in för att lägga till produkten i din varukorg!'
            }
        }));
    }
})



// ------------ reset password ----------------------- // 

router.get(ROUTE.resetpassword, (req, res) => {
    res.status(200).render(VIEW.resetpassword, {
        ROUTE,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

router.post(ROUTE.resetpassword, async (req, res) => {
    const user = await UserInfoModel.findOne({
        email: req.body.resetmail
    })
    if (!user) return res.redirect(ROUTE.error)
    crypto.randomBytes(32, async (error, token) => {
        if (error) return res.redirect(ROUTE.error);
        const resetToken = token.toString("hex");
        user.resetToken = resetToken
        user.expirationToken = Date.now() + 3600000
        await user.save();
        await transport.sendMail({
            to: req.body.resetmail,
            from: "<no-reply>vinylshopen@info",
            subject: "Ändra ditt lösenord!",
            html: `http://vinylfanny.herokuapp.com/resetpassword/${resetToken} <h2>Klicka på länken för att ändra ditt lösenord! Länken är giltig i 1 timme.<h2>`
        })
        res.redirect(ROUTE.login)
    })
})

router.get(ROUTE.resetpasswordToken, async (req, res) => {
    const token = req.params.token;
    const user = await UserInfoModel.findOne({
        resetToken: token,
        expirationToken: {
            $gt: Date.now()
        }
    });
    if (!user) return res.redirect(ROUTE.error);
    res.render(VIEW.resetform, {
        user,
        ROUTE,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    })
})

router.post(ROUTE.resetpasswordToken, async (req, res) => {
    const user = await UserInfoModel.findOne({
        resetToken: req.body.token
    })
    if (user) {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashPassword;
        user.resetToken = undefined;
        user.expirationToken = undefined;
        await user.save();
        return res.redirect(ROUTE.login);
    }
    return res.redirect(ROUTE.error);
})

router.get(ROUTE.logout, (req, res) => {
    res.clearCookie("jsonwebtoken").redirect(ROUTE.index);
})

module.exports = router;
