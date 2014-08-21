var express = require('express');
var router = express.Router();
var config = require('../../config');
var esdr = require('../../lib/esdr');
var RemoteError = require('../../lib/errors').RemoteError;
var log = require('log4js').getLogger();

router.put('/',
           function(req, res, next) {
              var verificationToken = req.body.token;
              log.debug("Received PUT to verify token [" + verificationToken + "]");
              if (verificationToken) {
                 // delegate verification to ESDR
                 esdr.verifyUser(verificationToken, function(err, result) {
                    if (err) {
                       if (err instanceof RemoteError) {
                          return res.jsendPassThrough(err.data);
                       }
                       var message = "Error while trying to verify user with verification token [" + verificationToken + "]";
                       log.error(message + ": " + err);
                       return res.jsendServerError(message);
                    }

                    res.jsendPassThrough(result);
                 });
              }
              else {
                 return res.jsendClientError("Verification token not specified.", null, 422);  // HTTP 422 Unprocessable Entity
              }
           }
);

module.exports = router;
