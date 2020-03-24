const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ROUTE = require('../constant')
const url = require("url");

module.exports = (req, res, next) => {

    const token = req.cookies.jsonwebtoken

    if (token) {
        const userInfo = jwt.verify(token, config.tokenkey.userjwt)
        req.body.userInfo = userInfo;
        next();
    } else {
        res.redirect(url.format({
            pathname: ROUTE.error,
            query: {
                errmsg: 'Du är inte inloggad!'
            }
        }));
    }

}