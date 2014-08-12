var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger();

// ensure the user is authenticated before serving up these pages
var ensureAuthenticated = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   // remember where the user was trying to go and then redirect to the login page
   req.session.redirectToAfterLogin = req.url;
   res.redirect('/login')
};

router.get('/dashboard',
           ensureAuthenticated,
           function(req, res) {
              res.render('dashboard', { title : "CATTfish: Dashboard", section : "dashboard"});
           });

router.get('/devices',
           ensureAuthenticated,
           function(req, res) {
              res.render('devices', { title : "CATTfish: Devices", section : "devices"});
           });

router.get('/account',
           ensureAuthenticated,
           function(req, res) {
              res.render('account', { title : "CATTfish: Account", section : "account"});
           });

module.exports = router;
