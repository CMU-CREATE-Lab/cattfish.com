var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger();

router.get('/', function(req, res) {
   if (req.user) {
      log.debug("Logout: destroying session for user: " + req.user.username);
   }
   req.logout();
   res.redirect('/');
});

module.exports = router;
