const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserInfoModel = require('../model/user');
const constant = require('../constant');


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
    res.redirect(constant.VIEW.gallery)

})

router.get(constant.ROUTE.login, (req, res) => {
    res.status(200).render(constant.VIEW.login, {
        constant
    });
})

router.post(constant.ROUTE.login, async (req, res) => {

    const admin = await UserInfoModel.findOne({
        email: req.body.email
    });

    // OM ADMIN HAR VÄRDET ADMIN: FALSE
    if (!admin.isAdmin) {
        const user = await UserInfoModel.findOne({ email: req.body.email });
        if (!user) return res.render("errors", { errmsg: 'Fel email!' });

        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) return res.render("errors", { errmsg: 'Fel lösenord!' });

        if (validUser) return res.redirect(constant.VIEW.userAccount);
    }

    if (!admin) {
        res.redirect(constant.ROUTE.index);
    }
    const validAdmin = await bcrypt.compare(req.body.password, admin.password);

    if (validAdmin) {
        res.redirect(constant.ROUTE.admin);
    }
})

router.get(constant.ROUTE.userAccount, async (req, res) => {
    const showUserInfo = await UserInfoModel.findOne();
    console.log(showUserInfo)
    res.status(200).render(constant.VIEW.userAccount, {
        constant,
        showUserInfo
    });
})

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