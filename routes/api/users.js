var express = require('express');
var router = express.Router();
var request = require('request');
var JaySchema = require('jayschema');
var config = require('../../config');
var UserSchema = require('../../models/json-schemas').UserSchema;
var log = require('log4js').getLogger();

var jsonValidator = new JaySchema();

module.exports = function(UserModel) {

   // Creates a new user
   router.post('/', function(req, res, next) {
      var user = req.body;

      // validate JSON (asynchronously)
      jsonValidator.validate(user, UserSchema, function(err1) {
         if (err1) {
            return res.jsendClientError(err1);
         }

         log.debug("Received POST to create user [" + user.username + "]. Delegating to ESDR...");

         request.post(config.get("esdr:apiRootUrl") + "/users",
                      {
                         json : user
                      },
                      function(err2, response, body) {
                         if (err2) {
                            log.error("/users: failed to delegate to ESDR: " + err2);

                            return res.jsendServerError("Error communicating with ESDR service");
                         }

                         // see whether this was a JSON response--if so, assume JSend
                         if (response['headers']['content-type'].lastIndexOf("application/json", 0) === 0) {
                            // Pass through the JSend response from ESDR.  In the future, I'll probably want to
                            // do something fancier here, but this is good enough for now.
                            return res.jsendPassThrough(body);
                         }

                         // if not a JSON response, then create a new JSend server error response
                         return res.jsendServerError("Unexpected error: ESDR service responded with HTTP " + response.statusCode);
                      });
      });
   });

   return router;
};

