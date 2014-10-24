var express = require('express');
var router = express.Router();
var esdr = require('../lib/esdr');

var log = require('log4js').getLogger();

router.get('/',
           function(req, res, next) {
              log.debug("ACCOUNT!");
              log.debug("res.locals.user=" + JSON.stringify(res.locals.user, null, 3));
              log.debug("req.user=" + JSON.stringify(req.user, null, 3));
              esdr.getUserInfo(req.user.esdrUserId, req.user.accessToken, function(err, userInfoResponse) {
                 // TODO: What to do if there's an error?
                 if (err) {
                    log.error("GET /account error: " + JSON.stringify(err, null, 3))
                    res.render('error',
                                      {
                                         layout : "error-layout",
                                         title : "Unexpected Error",
                                         section : "account",
                                         message : "Sorry, an unexpected error has occurred. Please try again later or contact us for help."
                                      });
                 }
                 else {
                    log.debug("req.user=" + JSON.stringify(userInfoResponse, null, 3));

                    res.render('account',
                               {
                                  title : "CATTfish: Account",
                                  section : "account",
                                  userInfo : userInfoResponse.data
                               });
                 }
              });
           });

module.exports = router;
