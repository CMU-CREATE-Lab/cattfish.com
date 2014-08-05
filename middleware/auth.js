var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var esdr = require('../lib/esdr');
var log = require('log4js').getLogger();

module.exports = function(UserModel) {

   passport.use(new LocalStrategy({
                                     usernameField : 'email',
                                     passwordField : 'password'
                                  },
                                  function(email, password, done) {
                                     log.debug("Oauth to ESDR for login of user [" + email + "]");
                                     esdr.authenticateUser(email, password, function(err, user, data) {
                                        if (!err && user) {
                                           // If we successfully authenticated the user, then save
                                           UserModel.createOrUpdateTokens(user, function(err, result) {
                                              if (err) {
                                                 return done(err, false);
                                              }
                                              // need to add the ID so we can store it in the session
                                              user.id = result.id;
                                              return done(err, user, data);
                                           });
                                        }
                                        else {
                                           return done(err, user, data);
                                        }
                                     });
                                  }
   ));

   passport.serializeUser(function(user, done) {
      log.debug("serializing user " + user.id + " (ESDR user " + user.esdrUserId + ")");
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
      UserModel.findById(id, function(err, user) {
         log.debug("deserializing user " + id + " (ESDR user " + user.esdrUserId + ")");
         done(err, user);
      });
   });
};

