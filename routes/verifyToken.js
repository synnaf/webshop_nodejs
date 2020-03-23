const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {

    const token = req.cookies.jsonwebtoken
 
    if (token) {
        const userInfo = jwt.verify(token, config.tokenkey.userjwt)
        req.body = userInfo;
        next(); 
    } else {
        res.render('errors', {
            errmsg: 'Du är inte inloggad!',
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        });
    }

}