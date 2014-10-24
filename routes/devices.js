var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/',
           function(req, res) {
              res.render('devices',
                         {
                            title : "CATTfish: Devices",
                            section : "devices",
                            cattfish_product_id : config.get("product:id")
                         });
           });

module.exports = router;
