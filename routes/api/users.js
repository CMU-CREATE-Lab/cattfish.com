var express = require('express');
var router = express.Router();
var JaySchema = require('jayschema');
var config = require('../../config');
var esdr = require('../../lib/esdr');
var ValidationError = require('../../lib/errors').ValidationError;
var DuplicateRecordError = require('../../lib/errors').DuplicateRecordError;
var RemoteError = require('../../lib/errors').RemoteError;
var log = require('log4js').getLogger();

module.exports = function(UserModel) {

   // Creates a new user
   router.post('/', function(req, res, next) {
      var user = req.body;

      log.debug("Received POST to create user [" + user.email + "]");

      UserModel.create(user, function(err, result) {
         if (err) {
            if (err instanceof ValidationError) {
               return res.jsendClientError("Validation failure", err.data, 400);
            }
            if (err instanceof DuplicateRecordError) {
               return res.jsendClientError("User already exists", err.data, 409);
            }
            return res.jsendServerError(err.message, err.data);
         }

         // build the return object
         var obj = {
            email : result.email,
            displayName : result.displayName
         };
         // Only return the verification token when in test mode.  In other modes, ESDR will
         // email the verification token to the user, to ensure the email address is correct
         // and actually belongs to the person who created the account.
         if (process.env['NODE_ENV'] == "test" && result.verificationToken) {
            obj.verificationToken = result.verificationToken
         }

         return res.jsendSuccess(obj, 201);
      });
   });

   router.get('/:verificationToken/verify',
              function(req, res, next) {
                 // delegate verification to ESDR
                 esdr.verifyUser(req.params.verificationToken, function(err, result) {
                    if (err) {
                       if (err instanceof RemoteError) {
                          log.debug(err);
                          return res.jsendPassThrough(err.data);
                       }
                       var message = "Error while trying to verify user with verification token [" + req.params.verificationToken + "]";
                       log.error(message + ": " + err);
                       return res.jsendServerError(message);
                    }

                    res.jsendPassThrough(result);
                 });
              }
   );

   return router;
};

