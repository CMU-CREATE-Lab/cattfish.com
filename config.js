var config = require('nconf');

config.argv().env().file({ file : './config.json' });

config.defaults({
                   "server" : {
                      "port" : 3333
                   },
                   "esdr" : {
                      "apiRootUrl" : "ESDR_API_ROOT_URL"
                   },
                   "cookie" : {
                      "secret" : "YOUR_COOKIE_SECRET"
                   },
                   "oauth" : {
                      "tokenURL" : "OAUTH2_TOKEN_SERVER_URL",
                      "clientID" : "YOUR_OAUTH2_CLIENT_ID",
                      "clientSecret" : "YOUR_OAUTH2_CLIENT_SECRET"
                   },
                   "database" : {
                      "url" : "mongodb://localhost/cattfish",
                      "options" : {
                         "server" : {
                            "socketOptions" : {
                               "keepAlive" : 1
                            }
                         },
                         "replset" : {
                            "socketOptions" : {
                               "keepAlive" : 1
                            }
                         }
                      }
                   }
                });

module.exports = config;