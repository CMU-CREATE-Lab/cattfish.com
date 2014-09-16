var express = require('express');
var router = express.Router();

router.get('/',
           function(req, res) {
              res.render('dashboard', { title : "CATTfish: Dashboard", section : "dashboard"});
           });

module.exports = router;
