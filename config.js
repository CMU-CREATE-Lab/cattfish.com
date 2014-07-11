var config = require('nconf');
var log = require('log4js').getLogger();

var nodeEnvironment = process.env.NODE_ENV || "development";
var configFile = './config-' + nodeEnvironment + '.json';
log.info("Using config file: " + configFile);

config.argv().env().file({ file : configFile });

config.defaults({
                   "server" : {
                      "port" : 3333
                   },
                   "esdr" : {
                      "apiRootUrl" : "ESDR_API_ROOT_URL"
                   },
                   "cookie" : {
                      "name" : "sid",
                      "secret" : "YOUR_COOKIE_SECRET"
                   },
                   "oauth" : {
                      "tokenURL" : "OAUTH2_TOKEN_SERVER_URL",
                      "clientId" : "YOUR_OAUTH2_CLIENT_ID",
                      "clientSecret" : "YOUR_OAUTH2_CLIENT_SECRET"
                   },
                   "database" : {
                      "host" : "DATABASE_HOST",
                      "port" : "3306",
                      "database" : "DATABASE_NAME",
                      "username" : "USERNAME",
                      "password" : "PASSWORD",
                      "pool" : {
                         "connectionLimit" : 10
                      }
                   }
                });

module.exports = config;