var config = require('../config');
var esdr = require('../lib/esdr');
var ValidationError = require('../lib/errors').ValidationError;
var RemoteError = require('../lib/errors').RemoteError;
var DuplicateRecordError = require('../lib/errors').DuplicateRecordError;
var log = require('log4js').getLogger();

var CREATE_TABLE_QUERY = " CREATE TABLE IF NOT EXISTS `Users` ( " +
                         "`id` bigint(20) NOT NULL AUTO_INCREMENT, " +
                         "`esdrUserId` bigint(20) NOT NULL, " +
                         "`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                         "`modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                         "`lastLogin` timestamp, " +
                         "`accessToken` varchar(255) DEFAULT NULL, " +
                         "`refreshToken` varchar(255) DEFAULT NULL, " +
                         "`accessTokenExpiration` timestamp, " +
                         "PRIMARY KEY (`id`), " +
                         "UNIQUE KEY `unique_esdrUserId` (`esdrUserId`) " +
                         ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";

module.exports = function(databaseHelper) {

   this.initialize = function(callback) {
      databaseHelper.execute(CREATE_TABLE_QUERY, [], function(err) {
         if (err) {
            log.error("Error trying to create the Users table: " + err);
            return callback(err);
         }

         return callback(null, true);
      });
   };

   this.create = function(user, callback) {
      // Delegate to ESDR to handle validation and check whether the user already exists.  Note that the user might
      // already exist in ESDR, but not here--that's totally normal.  But, still respond here that the account is a
      // duplicate.  When the user logs in here, we'll pull the details from ESDR and save here.
      esdr.createUser(user, function(err1, createResult) {
         // Check the error/result to see whether it was a 201 (Created), 409 (Conflict), or a 422 (Unprocessable
         // Entity), or something else and act accordingly.  If the code was a 201, then the user was created in ESDR
         // and we need to insert here, too. If a 422, then the user probably submitted the form with missing required
         // fields. If 409, then a user with the same email already exists in ESDR, so we need to throw a
         // DuplicateRecordError.
         if (err1) {
            if (err1 instanceof RemoteError) {
               if (err1.data.code == 409) {
                  // a user with this email address already exists in ESDR
                  return callback(new DuplicateRecordError({email : user.email}, "User already exists."));
               }
               if (err1.data.code == 422) {
                  return callback(new ValidationError(err1.data.data, err1.data.message));
               }
            }

            log.error("Error while trying to create a user in ESDR: " + JSON.stringify(err1, null, 3));
            return callback(err1);
         }
         else {
            if (createResult.code == 201) {
               // user created in ESDR, so create here, too
               return insertUser(createResult.data, callback);
            }

            return callback(new Error("Unexpected error: ESDR service responded with HTTP " + createResult.code));
         }
      });
   };

   var insertUser = function(user, callback) {
      databaseHelper.execute("INSERT INTO Users SET ?",
                             {
                                esdrUserId : user.id
                             },
                             function(err, result) {
                                if (err) {
                                   log.error("Users.insertUser():Error trying to create or update user with ESDR ID [" + user.id + "]: " + err);
                                   return callback(err);
                                }

                                return callback(null, {
                                   id : result.insertId,
                                   email : user.email,
                                   displayName : user.displayName,
                                   verificationToken : user.verificationToken
                                });
                             });
   };

   this.createOrUpdateTokens = function(user, callback) {
      log.debug("createOrUpdateTokens for user: " + JSON.stringify(user, null, 3));
      databaseHelper.execute("INSERT INTO Users SET ? ON DUPLICATE KEY UPDATE " +
                             "lastLogin=VALUES(lastLogin), " +
                             "accessToken=VALUES(accessToken), " +
                             "refreshToken=VALUES(refreshToken), " +
                             "accessTokenExpiration=VALUES(accessTokenExpiration)",
                             user,
                             function(err, result) {
                                if (err) {
                                   log.error("Error trying to create or update user [" + user.email + "]: " + err);
                                   return callback(err);
                                }

                                return callback(null, {id : result.insertId});
                             });
   };

   /**
    * Tries to find the user with the given <code>userId</code> and returns it to the given <code>callback</code>. If
    * successful, the user is returned as the 2nd argument to the <code>callback</code> function.  If unsuccessful,
    * <code>null</code> is returned to the callback.
    *
    * @param {int} userId ID of the user to find.
    * @param {function} callback function with signature <code>callback(err, user)</code>
    */
   this.findById = function(userId, callback) {
      findUser("SELECT * FROM Users WHERE id=?", [userId], callback);
   };

   /**
    * Tries to find the user with the given ESDR User Id and returns it to the given <code>callback</code>. If
    * successful, the user is returned as the 2nd argument to the <code>callback</code> function.  If unsuccessful,
    * <code>null</code> is returned to the callback.
    *
    * @param {string} esdrUserId ESDR User ID of the user to find.
    * @param {function} callback function with signature <code>callback(err, user)</code>
    */
   this.findByEsdrId = function(esdrUserId, callback) {
      findUser("SELECT * FROM Users WHERE esdrUserId=?", [esdrUserId], callback);
   };

   var findUser = function(query, params, callback) {
      databaseHelper.findOne(query, params, function(err, user) {
         if (err) {
            log.error("Error trying to find user: " + err);
            return callback(err);
         }

         return callback(null, user);
      });
   };

   this.createResetPasswordRequest = function(email, callback) {
      // delegate reset password to ESDR
      esdr.createResetPasswordRequest(email, function(err, result) {
         if (err) {
            if (err instanceof RemoteError) {
               if (err.data.code == 422) {
                  return callback(new ValidationError(err.data.data, err.data.message));
               }
               return callback(err);
            }

            log.error("Error while trying to request a password reset from ESDR for email [" + email + "]: " + err);
            return callback(err);
         }
         else {
            if (result.code == 201) {
               return callback(null, result);
            }

            return callback(new Error("Unexpected error: ESDR service responded with HTTP " + result.code));
         }
      });
   };

   this.setNewPassword = function(resetPasswordToken, newPassword, callback) {
      // delegate set password to ESDR
      esdr.setNewPassword(resetPasswordToken, newPassword, function(err, result) {
         if (err) {
            if (err instanceof RemoteError) {
               if (err.data.code == 422) {
                  return callback(new ValidationError(err.data.data, err.data.message));
               }
               return callback(err);
            }

            log.error("Error while trying to set a new password for token [" + resetPasswordToken + "]: " + err);
            return callback(err);
         }
         else {
            if (result.code == 200) {
               return callback(null, result);
            }

            return callback(new Error("Unexpected error: ESDR service responded with HTTP " + result.code));
         }
      });
   };
};
