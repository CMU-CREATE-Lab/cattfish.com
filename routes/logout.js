var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger('cattfish:routes:logout');

module.exports = function(UserModel) {

   router.get('/', function(req, res) {
      if (req.user) {
         var userId = req.user.id;
         log.debug("Logout: destroying session for user [" + userId + "]");
         process.nextTick(function() {
            UserModel.destroyTokens(userId, function(err, wasSuccessful) {
               if (err) {
                  log.error("Error while trying to delete tokens for user [" + userId + "]");
               }
            });
         });
      }
      req.logout();
      res.redirect('/');
   });

   return router;
};

