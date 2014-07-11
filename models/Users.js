var findOne = require('./db_utils').findOne;
var executeQuery = require('./db_utils').executeQuery;
var log = require('log4js').getLogger();

var CREATE_TABLE_QUERY = " CREATE TABLE IF NOT EXISTS `Users` ( " +
                         "`id` bigint(20) NOT NULL AUTO_INCREMENT, " +
                         "`username` varchar(255) NOT NULL, " +
                         "`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                         "`modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                         "`lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                         "`accessToken` varchar(255) NOT NULL, " +
                         "`refreshToken` varchar(255) NOT NULL, " +
                         "`accessTokenExpiration` timestamp NOT NULL, " +
                         "PRIMARY KEY (`id`), " +
                         "UNIQUE KEY `unique_username` (`username`) " +
                         ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";

module.exports = function(pool) {

   this.initialize = function(callback) {
      pool.getConnection(function(err1, connection) {
         if (err1) {
            callback(err1);
         }
         else {
            connection.query(CREATE_TABLE_QUERY, function(err2) {
               connection.release();

               if (err2) {
                  log.error("Error trying to create the Users table: " + err2);
                  callback(err2);
               }
               else {
                  callback(null, true);
               }
            });
         }
      });
   };

   this.createOrUpdateTokens = function(user, callback) {
      executeQuery(pool,
                   "INSERT INTO Users SET ? ON DUPLICATE KEY UPDATE " +
                   "lastLogin=VALUES(lastLogin), " +
                   "accessToken=VALUES(accessToken), " +
                   "refreshToken=VALUES(refreshToken), " +
                   "accessTokenExpiration=VALUES(accessTokenExpiration)",
                   user,
                   function(err, result) {
         if (err) {
            log.error("Error trying to create or update user [" + user.username + "]: " + err);
            return callback(err);
         }

         log.debug("Users.createOrUpdate() result: " + JSON.stringify(result, null, 3));
         return callback(null, {insertId : result.insertId});
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
      findUser(pool, "SELECT * FROM Users WHERE id=?", [userId], callback);
   };

   /**
    * Tries to find the user with the given <code>username</code> and returns it to the given <code>callback</code>. If
    * successful, the user is returned as the 2nd argument to the <code>callback</code> function.  If unsuccessful,
    * <code>null</code> is returned to the callback.
    *
    * @param {string} username username of the user to find.
    * @param {function} callback function with signature <code>callback(err, user)</code>
    */
   this.findByUsername = function(username, callback) {
      findUser(pool, "SELECT * FROM Users WHERE username=?", [username], callback);
   };

   var findUser = function(pool, query, params, callback) {
      findOne(pool, query, params, function(err, user) {
         if (err) {
            log.error("Error trying to find user: " + err);
            return callback(err);
         }

         return callback(null, user);
      });
   };
};
