var config = require('nconf');
var path = require('path');
var log = require('log4js').getLogger('cattfish:config');
var RunMode = require('run-mode');

var configFile = './config-' + RunMode.get() + '.json';
log.info("Using config file: " + configFile);

config.argv().env().file({ file : configFile });

config.defaults({
                   "server" : {
                      "url" : "http://localhost:3333",
                      "port" : 3333
                   },
                   "httpAccessLogDirectory" : path.join(__dirname, './logs/access.log'),
                   "esdr" : {
                      "rootUrl" : "http://localhost:3000",
                      "apiRootUrl" : "http://localhost:3000/api/v1",
                      "oauthTokenUrl" : "http://localhost:3000/oauth/token"
                   },
                   "product" : {
                      "id" : "THIS_WILL_BE_DETERMINED_AT_RUNTIME",
                      "name" : 'cattfish_v1',
                      "prettyName" : 'CATTfish v1',
                      "vendor" : 'MellonHead Labs',
                      "description" : 'The CATTfish v1 water temperature and conductivity sensor.',
                      "defaultChannelSpecs" : { "temperature" : { "prettyName" : "Temperature", "units" : "C" }, "conductivity" : { "prettyName" : "Conductivity", "units" : "&mu;S/cm" }, "battery_voltage" : { "prettyName" : "Battery Voltage", "units" : "V" }}
                   },
                   "cookie" : {
                      "name" : "cattfish_sid",
                      "secret" : "YOUR_COOKIE_SECRET"
                   },
                   "client" : {
                      "displayName" : "CATTfish",
                      "name" : "cattfish.com",
                      "secret" : "YOUR_OAUTH2_CLIENT_SECRET",
                      "email" : "admin@cattfish.com",
                      "isPublic" : true,
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