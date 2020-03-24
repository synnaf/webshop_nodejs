const jwt = require('jsonwebtoken');
const config = require('../config/config');
<<<<<<< HEAD
const ROUTE = require('../constant')
const url = require("url");
=======
const url = require('url');
>>>>>>> 6298ccb38ee28acf7dcd7a5b24e295f895e5f541

module.exports = (req, res, next) => {

    const token = req.cookies.jsonwebtoken

    if (token) {
        const userInfo = jwt.verify(token, config.tokenkey.userjwt)
        req.body = userInfo;
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