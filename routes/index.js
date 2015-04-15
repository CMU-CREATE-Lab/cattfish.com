var express = require('express');
var router = express.Router();
var config = require('../config');

//======================================================================================================================

router.get('/', function(req, res) {
   if (req.isAuthenticated()) {
      res.redirect('/dashboard');
   } else {
      res.render('index', { title : "CATTfish", section : "home"});
   }
});

//----------------------------------------------------------------------------------------------------------------------

router.get('/about', function(req, res) {
   res.render('about', { title : "CATTfish: About", section : "about"});
});

router.get('/about/water-quality-measures', function(req, res) {
   res.render('water-quality-measures', { title : "CATTfish: Water Quality Measures", section : "about:water-quality-measures"});
});

router.get('/about/partners', function(req, res) {
   res.render('partners', { title : "CATTfish: Partners", section : "about:partners"});
});

//----------------------------------------------------------------------------------------------------------------------

router.get('/contact', function(req, res) {
   res.render('contact', { title : "CATTfish: Contact", section : "contact"});
});

//----------------------------------------------------------------------------------------------------------------------

router.get('/terms', function(req, res) {
   res.render('terms/terms-of-service', { title : "CATTfish: Terms of Service", section : "terms-of-service"});
});

router.get('/terms/eula', function(req, res) {
   res.render('terms/eula', { title : "CATTfish: End User License Agreement", section : "terms:eula"});
});

router.get('/terms/privacy-statement', function(req, res) {
   res.render('terms/privacy-statement', { title : "CATTfish: Privacy Statement", section : "terms:privacy-statement"});
});

router.get('/terms/sales-terms', function(req, res) {
   res.render('terms/sales-terms', { title : "CATTfish: Sales Terms", section : "terms:sales-terms"});
});

router.get('/terms/privacy-policy', function(req, res) {
   res.render('terms/privacy-policy', { title : "CATTfish: Privacy Policy", section : "terms:privacy-policy"});
});

//----------------------------------------------------------------------------------------------------------------------

router.get('/data', function(req, res) {
   res.render('data', {
      title : "CATTfish: Data",
      section : "data",
      googleMapsApiKey : config.get("maps:apiKey"),
      cattfish_product_id : config.get("product:id")
   });
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
