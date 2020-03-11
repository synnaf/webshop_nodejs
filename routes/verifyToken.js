const jwt = require('jsonwebtoken')
const config = require('../config/config');

module.exports = (req, res, next) => {


    const token = req.cookies.jsonwebtoken
    console.log(token, "token")
    if (token) {

        const userInfo = jwt.verify(token, 'secretPriveteKey')
        console.log("user info", userInfo)
        req.userInfo = userInfo;
        next()
    } else {
        res.render('errors', {
            errmsg: 'Du är inte inloggad!'
        });
    }

}