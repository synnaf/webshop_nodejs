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

router.get(constant.ROUTE.loginUser, (req, res) => {
    res.status(200).render(constant.VIEW.loginUser);
})

router.post(constant.ROUTE.loginUser, async (req, res) => {
    const user = await UserInfoModel.findOne({email: req.body.email});
    if (!user) return res.render("errors", { errmsg: 'Fel email!' });

    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser) return res.render("errors", { errmsg: 'Fel lösenord!' });
    
    if (validUser) return res.redirect(constant.VIEW.userAccount); 
    
})

router.get(constant.ROUTE.userAccount, async (req, res) => {
    const showUserInfo = await UserInfoModel.findOne();
    console.log(showUserInfo)
    res.status(200).render(constant.VIEW.userAccount, {
        showUserInfo
    });
})




router.get(constant.ROUTE.confirmation, (req, res) => {
    res.status(200).render(constant.VIEW.confirmation);
})

module.exports = router;