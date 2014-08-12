var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
   res.render('login', { title : "CATTfish: Login", section : "login"});
});

router.post('/', function(req, res, next) {
   passport.authenticate('local', function(err, user, info) {
      if (err) {
         return next(err);
      }
      if (!user) {
         return res.jsendClientError("Login failed", null, 401);
      }
      req.logIn(user, function(err) {
         if (err) {
            return next(err);
         }
         return res.jsendSuccess({
                                    email : user.email,
                                    accessToken : user.accessToken,
                                    accessTokenExpiration : user.accessTokenExpiration
                                 });
      });
   })(req, res, next);
});

module.exports = router;
