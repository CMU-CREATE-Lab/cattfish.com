var express = require('express');
var router = express.Router();
var JaySchema = require('jayschema');
var config = require('../../config');
var log = require('log4js').getLogger();
var esdr = require('../../lib/esdr');
var ValidationError = require('../../lib/errors').ValidationError;
var DuplicateRecordError = require('../../lib/errors').DuplicateRecordError;

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

         return res.jsendSuccess(result, 201);
      });
   });

   router.get('/:verificationToken/verify',
              function(req, res, next) {
                 // delegate verification to ESDR
                 esdr.verifyUser(req.params.verificationToken, function(err, result) {
                    if (err) {
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

