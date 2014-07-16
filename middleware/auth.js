var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var log = require('log4js').getLogger();
var config = require('../config');

module.exports = function(UserModel) {

   passport.use(new LocalStrategy(function(username, password, done) {
                                     log.debug("Oauth to ESDR for login of user [" + username + "]");
                                     var url = config.get("oauth:tokenUrl");
                                     request.post(url, {
                                        form : {
                                           grant_type : 'password',
                                           client_id : config.get("oauth:clientId"),
                                           client_secret : config.get("oauth:clientSecret"),
                                           username : username,
                                           password : password
                                        }
                                     }, function(error, response, body) {
                                        if (error) {
                                           log.debug("   ESDR oauth failed: " + error);
                                           return done(error, false);
                                        }

                                        try {
                                           var jsonResponse = JSON.parse(body);
                                           if (response.statusCode === 200 && jsonResponse.access_token) {
                                              var tokens = jsonResponse;
                                              log.debug("   ESDR oauth for user [" + username + "] successful!");
                                              var user = {
                                                 username : username,
                                                 lastLogin : new Date(),
                                                 accessToken : tokens.access_token,
                                                 refreshToken : tokens.refresh_token,
                                                 accessTokenExpiration : new Date(new Date().getTime() + (tokens.expires_in * 1000))
                                              };
                                              UserModel.createOrUpdateTokens(user, function(err, result) {
                                                 if (err) {
                                                    return done(err, false);
                                                 }
                                                 // need to add the ID so we can store it in the session
                                                 user.id = result.insertId;
                                                 return done(null, user);
                                              });
                                           }
                                           else if (response.statusCode === 403) {
                                              log.debug("   ESDR oauth for user [" + username + "] failed.");
                                              return done(null, false, {
                                                 message : 'Login failed.',
                                                 error : jsonResponse.error || "unknown error",
                                                 error_description : jsonResponse.error_description || "unknown error while authenticating user " + username
                                              });
                                           }
                                           else {
                                              log.error("   ESDR oauth for user [" + username + "] failed due to unknown error.  HTTP status [" + response.statusCode + "]");
                                              return done(null, false, { message : 'Unknown error, HTTP status [' + response.statusCode + ']' });
                                           }
                                        }
                                        catch (e) {
                                           log.error("   Unexpected exception while trying to authenticate user [" + username + "] with ESDR: " + e);
                                           return done(null, false, { message : 'Unexpected error, please try again later.' }); // TODO: should this be null and false?
                                        }

                                     });
                                  }
   ));

   passport.serializeUser(function(user, done) {
      log.debug("serializing user: " + user.username);
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
      UserModel.findById(id, function(err, user) {
         log.debug("deserializeUser user: " + user.username);
         done(err, user);
      });
   });
};

