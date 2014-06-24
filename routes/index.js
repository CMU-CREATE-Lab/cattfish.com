var express = require('express');
var router = express.Router();
var passport = require('passport');
var log = require('log4js').getLogger();

router.get('/', function(req, res) {
   res.render('index', { title : "cattfish.com"});
});

router.get('/register', function(req, res) {
   res.render('register', { title : "Register"});
});

router.get('/login', function(req, res) {
   res.render('login', { title : 'Login' });
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
