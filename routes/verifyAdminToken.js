const jwt = require('jsonwebtoken');
const config = require('../config/config');
const constant = require('../constant');

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