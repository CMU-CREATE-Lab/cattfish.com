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

router.get('/verify/:verificationToken', function(req, res) {
   // since we'll be injecting the verification token into JavaScript,
   // be paranoid and remove anything that's not a valid hex character
   var cleanedVerificationToken = (req.params.verificationToken) ? req.params.verificationToken.replace(/([^a-f0-9]+)/gi, '') : "";
   res.render('verify', { title : "CATTfish: Verify Your Account", verificationToken : cleanedVerificationToken});
});

module.exports = router;
