var log = require('log4js').getLogger();
var config = require('../config');
var RemoteError = require('../lib/errors').RemoteError;
var superagent = require('superagent');

/**
 * Attempts to call ESDR to create the given <code>client</code>.  If successful, the JSend response from ESDR is given
 * to the given <code>callback</code>
 * @param {object} client The client to create
 * @param {function} callback The callback function to receive the error or success data
 */
var createClient = function(client, callback) {
   superagent
         .post(config.get("esdr:apiRootUrl") + "/clients")
         .send(client)
         .end(function(err, res) {
                 if (err) {
                    log.error("Failed to delegate to ESDR: " + err);

                    return callback(err);
                 }

                 // see whether this was a JSend response
                 if (isJSendResponse(res)) {
                    if (res.body.status == 'success') {
                       return callback(null, res.body);
                    }
                    return callback(new RemoteError(res.body));
                 }

                 // if not a JSend response, then create a new JSend server error response
                 return callback(new Error("Unexpected error: ESDR service responded with HTTP " + res.statusCode));
              });
};

var createUser = function(user, callback) {
   superagent
         .post(config.get("esdr:apiRootUrl") + "/users")
         .send({
                  user : user,
                  client : {
                     clientName : config.get("oauth:clientId"),
                     clientSecret : config.get("oauth:clientSecret")
                  }
               })
         .end(function(err, res) {
                 if (err) {
                    log.error("Failed to delegate to ESDR: " + err);

                    return callback(err);
                 }

                 // see whether this was a JSend response
                 if (isJSendResponse(res)) {
                    if (res.body.status == 'success') {
                       return callback(null, res.body);
                    }
                    return callback(new RemoteError(res.body));
                 }

                 // if not a JSend response, then create a new error
                 return callback(new Error("Unexpected error: ESDR service responded with HTTP " + res.statusCode));
              });
};

var authenticateUser = function(email, password, callback) {
   log.debug("esdr.authenticateUser(" + email + ")");
   var url = config.get("oauth:tokenUrl");
   superagent
         .post(url)
         .type('form')
         .send({
                  grant_type : 'password',
                  client_id : config.get("oauth:clientId"),
                  client_secret : config.get("oauth:clientSecret"),
                  username : email,
                  password : password
               })
         .end(function(err, res) {
                 if (err) {
                    log.error("   ESDR oauth failed: " + err);
                    return callback(err, false);
                 }

                 try {
                    if (res.statusCode === 200) {
                       var tokenResponse = res.body;
                       log.debug("esdr.authenticateUser: " + JSON.stringify(res.body, null, 3));
                       var user = {
                          esdrUserId : tokenResponse.userId,
                          lastLogin : new Date(),
                          accessToken : tokenResponse.access_token,
                          refreshToken : tokenResponse.refresh_token,
                          accessTokenExpiration : new Date(new Date().getTime() + (tokenResponse.expires_in * 1000))
                       };
                       return callback(null, user);
                    }
                    else if (res.statusCode === 401) {
                       return callback(null, false, {
                          message : 'Client authentication failed.',
                          error : "Invalid client credentials",
                          error_description : "Client authentication failed"
                       });
                    }
                    else if (res.statusCode === 403) {
                       var jsonResponse = res.body;

                       return callback(null, false, {
                          message : 'User authentication failed.',
                          error : jsonResponse.error || "unknown error",
                          error_description : jsonResponse.error_description || "unknown error while authenticating user " + email
                       });
                    }
                    else {
                       log.error("   ESDR oauth for user [" + email + "] failed due to unknown error.  HTTP status [" + res.statusCode + "]");
                       return callback(null, false, { message : 'Unknown error, HTTP status [' + res.statusCode + ']' });
                    }
                 }
                 catch (e) {
                    log.error("   Unexpected exception while trying to authenticate user [" + email + "] with ESDR: " + e);
                    return callback(null, false, { message : 'Unexpected error, please try again later.' }); // TODO: should this be null and false?
                 }
              });
};

var verifyUser = function(verficationToken, callback) {
   superagent
         .get(config.get("esdr:apiRootUrl") + "/users/" + verficationToken + "/verify")
         .end(function(err, res) {
                 if (err) {
                    return callback(err);
                 }

                 // see whether this was a JSend response
                 if (isJSendResponse(res)) {
                    if (res.body.status == 'success') {
                       return callback(null, res.body);
                    }
                    return callback(new RemoteError(res.body));
                 }

                 // if not a JSend response, then create a new error
                 return callback(new Error("Unexpected error: ESDR service responded with HTTP " + res.statusCode + " while trying to verify user with token [" + verficationToken + "]"));
              }
   );
};

var isJSendResponse = function(response) {
   return (response['headers']['content-type'].lastIndexOf("application/json", 0) === 0 && response.body && response.body.status);
};

module.exports.createClient = createClient;
module.exports.createUser = createUser;
module.exports.authenticateUser = authenticateUser;
module.exports.verifyUser = verifyUser;