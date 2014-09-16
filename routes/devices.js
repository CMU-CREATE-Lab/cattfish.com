var express = require('express');
var router = express.Router();

router.get('/',
           function(req, res) {
              res.render('devices', { title : "CATTfish: Devices", section : "devices"});
           });

module.exports = router;
