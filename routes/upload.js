var express = require('express');
var router = express.Router();
var passport = require('passport');
var httpStatus = require('http-status');
var config = require('../config');

router.get('/', function(req, res) {
   res.render('upload/index',
              {
                 layout : "upload-layout",
                 title : "CATTfish: Upload",
                 esdrApiUrl : config.get("esdr:apiRootUrl"),
                 googleMapsApiKey : config.get("maps:apiKey")
              });
});

router.get('/upload-client.js', function(req, res) {
   res.type('text/javascript').render('upload/upload-client', { layout : false, cattfishUrl : config.get("server:url")});
});

module.exports = router;
