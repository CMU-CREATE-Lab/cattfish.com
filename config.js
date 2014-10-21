var config = require('nconf');
var log = require('log4js').getLogger();

var nodeEnvironment = process.env.NODE_ENV || "development";
var configFile = './config-' + nodeEnvironment + '.json';
log.info("Using config file: " + configFile);

config.argv().env().file({ file : configFile });

config.defaults({
                   "server" : {
                      "url" : "http://localhost:3333",
                      "port" : 3333
                   },
                   "esdr" : {
                      "rootUrl" : "http://localhost:3000",
                      "apiRootUrl" : "http://localhost:3000/api/v1",
                      "oauthTokenUrl" : "http://localhost:3000/oauth/token"
                   },
                   "product" : {
                      "name" : "cattfish_v2",
                      "id" : "THIS_WILL_BE_DETERMINED_AT_RUNTIME"
                   },
                   "cookie" : {
                      "name" : "sid",
                      "secret" : "YOUR_COOKIE_SECRET"
                   },
                   "client" : {
                      "displayName" : "CATTFish Web Site",
                      "name" : "cattfish.com",
                      "secret" : "YOUR_OAUTH2_CLIENT_SECRET",
                      "email" : "admin@cattfish.com",
                      "resetPasswordToken" : {
                         "url" : "http://localhost:3333/password-reset/:resetPasswordToken",
                         "willReturnViaApi" : false,
                         "willEmailToUser" : true
                      },
                      "verificationToken" : {
                         "url" : "http://localhost:3333/verification/:verificationToken",
                         "willReturnViaApi" : false,
                         "willEmailToUser" : true
                      }
                   },
                   "maps" : {
                      "apiKey" : "AIzaSyAx4X9rCsb7BguosyqSxatdxjzUeQMvM4w"
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