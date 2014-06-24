var express = require('express');
var router = express.Router();
var passport = require('passport');
var log = require('log4js').getLogger();

router.get('/', function(req, res) {
   res.render('index', { title : "CATTfish", section: "home"});
});

router.get('/about', function(req, res) {
   res.render('about', { title : "CATTfish: About", section: "about"});
});

router.get('/contact', function(req, res) {
   res.render('contact', { title : "CATTfish: Contact", section: "contact"});
});

router.get('/data', function(req, res) {
   res.render('data', { title : "CATTfish: Data", section: "data"});
});

router.get('/register', function(req, res) {
   res.render('register', { title : "CATTfish: Register"});
});

router.get('/login', function(req, res) {
   res.render('login', { title : 'CATTfish: Login' });
});

router.post('/login', passport.authenticate('local',
                                            {
                                               successRedirect : '/',
                                               failureRedirect : '/login',
                                               failureFlash : true
                                            }
));

router.get('/logout', function(req, res) {
   if (req.user) {
      log.debug("Logout: destroying session for user: " + req.user.username);
   }
   req.logout();
   res.redirect('/');
});

module.exports = router;
