var express = require('express');
var router = express.Router();

//======================================================================================================================

router.get('/', function(req, res) {
   if (req.isAuthenticated()) {
      res.redirect('/dashboard');
   } else {
      res.render('index', { title : "CATTfish", section : "home"});
   }
});

router.get('/about', function(req, res) {
   res.render('about', { title : "CATTfish: About", section : "about"});
});

router.get('/about/water-quality-measures', function(req, res) {
   res.render('water-quality-measures', { title : "CATTfish: Water Quality Measures", section : "about:water-quality-measures"});
});

router.get('/about/partners', function(req, res) {
   res.render('partners', { title : "CATTfish: Partners", section : "about:partners"});
});

router.get('/contact', function(req, res) {
   res.render('contact', { title : "CATTfish: Contact", section : "contact"});
});

router.get('/data', function(req, res) {
   res.render('data', { title : "CATTfish: Data", section : "data"});
});

router.get('/signup', function(req, res) {
   res.render('signup', { title : "CATTfish: Sign Up", section : "signup"});
});

//======================================================================================================================

router.get('/verification/:verificationToken', function(req, res) {
   // since we'll be injecting the verification token into JavaScript,
   // be paranoid and remove anything that's not a valid hex character
   var cleanedVerificationToken = (req.params.verificationToken) ? req.params.verificationToken.replace(/([^a-f0-9]+)/gi, '') : "";
   res.render('verification', { title : "CATTfish: Verify Your Account", verificationToken : cleanedVerificationToken});
});

router.get('/verification', function(req, res) {
   res.render('verification', { title : "CATTfish: Resend Account Verification Email"});
});

//======================================================================================================================

module.exports = router;
