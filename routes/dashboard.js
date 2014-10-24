var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/',
           function(req, res) {
              res.render('dashboard',
                         {
                            title : "CATTfish: Dashboard",
                            section : "dashboard",
                            googleMapsApiKey : config.get("maps:apiKey")
                         });
           });

module.exports = router;
