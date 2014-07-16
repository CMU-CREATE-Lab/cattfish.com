var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
   res.render('index', { title : "CATTfish", section : "home"});
});

router.get('/about', function(req, res) {
   res.render('about', { title : "CATTfish: About", section : "about"});
});

router.get('/contact', function(req, res) {
   res.render('contact', { title : "CATTfish: Contact", section : "contact"});
});

router.get('/data', function(req, res) {
   res.render('data', { title : "CATTfish: Data", section : "data"});
});

router.get('/register', function(req, res) {
   res.render('register', { title : "CATTfish: Register"});
});

module.exports = router;
