const jwt = require('jsonwebtoken');
const config = require('../config/config');
const constant = require('../constant');
<<<<<<< HEAD
const url = require("url");
=======
const url = require('url');
>>>>>>> 6298ccb38ee28acf7dcd7a5b24e295f895e5f541

module.exports = (req, res, next) => {

    const token = req.cookies.jsonwebtoken

    if (token) {

        const userInfo = jwt.verify(token, config.tokenkey.adminjwt)
        req.userInfo = userInfo;

        if (userInfo.userInfo.isAdmin == true) {
            next();
        }

        else {
            res.redirect(constant.ROUTE.index);
        }

    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du är inte inloggad!'
            }
        }));
    }

}