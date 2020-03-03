const express = require('express');
const router = express.Router();
const productModel = require('../model/product');
const serverVariable = require('../serverVariable');


router.get(serverVariable.ROUTE.loginAdmin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.loginAdmin);
})

router.get(serverVariable.ROUTE.admin, (req, res) => {
    res.status(200).render(serverVariable.VIEW.admin);
})

router.post(serverVariable.ROUTE.admin, (req, res) => {
    new productModel({
        artist: req.body.artist,
        vinylRecord: req.body.vinylRecord,
        vinylRecordPrice: req.body.vinylRecordPrice,
        vinylRecordDescription: req.body.vinylRecordDescription,
        imgUrl: req.body.imgUrl

    }).save()
    res.redirect("/gallery")
})

module.exports = router;