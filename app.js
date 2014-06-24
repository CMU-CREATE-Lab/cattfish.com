// dependencies
var express = require('express');
var expressHandlebars = require('express3-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var compress = require('compression');
var requestLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var log = require('log4js').getLogger();
var config = require('./config');

// decorate express.response with JSend methods
require('./lib/jsend');

// middleware
var error_handlers = require('./middleware/error_handlers');

// models
var UserModel = require('./models').UserModel;

var app = null;

// Got all this connection business from http://phaninder.com/posts/mongodbmongoose-connect-best-practices
mongoose.connection.on("connected", function() {
   log.info("Connected to database!");

   // VIEW -------------------------------------------------------------------------------------------------------------

   // setup view engine
   var viewsDir = path.join(__dirname, 'views');
   app.set('views', viewsDir);
   var handlebars = expressHandlebars.create({
                                                extname : '.hbs',
                                                defaultLayout : 'main',
                                                layoutsDir : path.join(viewsDir, "layouts"),
                                                partialsDir : path.join(viewsDir, "partials")
                                             });
   app.engine('hbs', handlebars.engine);
   app.set('view engine', '.hbs');
   app.set('view cache', app.get('env') === 'production');           // only cache views in production
   log.info("View cache enabled = " + app.enabled('view cache'));

   // MIDDLEWARE ------------------------------------------------------------------------------------------------------

   // setup middleware
   app.use(favicon(path.join(__dirname, 'public/favicon.ico')));     // favicon serving
   app.use(compress());                // enables gzip compression
   app.use(requestLogger('dev'));      // request logging
   app.use(express.static(path.join(__dirname, 'public')));          // static file serving
   app.use(bodyParser.urlencoded({ extended : true }));     // form parsing
   app.use(bodyParser.json());         // json body parsing
   app.use(function(error, req, res, next) { // function MUST have arity 4 here!
      // catch invalid JSON error (found at http://stackoverflow.com/a/15819808/703200)
      res.status(400).json({status : "fail", data : "invalid JSON"})
   });
   app.use(flash());                   // adds a req.flash() function to all requests for displaying one-time messages to the user
   app.use(cookieParser());            // cookie parsing--MUST come before setting up session middleware!
   app.use(session({                   // configure session support
                      secret : config.get("cookie:secret"),
                      name : 'sid',
                      store : new MongoStore({
                                                mongoose_connection : mongoose.connection
                                             })
                   }));
   app.use(passport.initialize());                                   // initialize passport (must come AFTER session middleware)
   app.use(passport.session());                                      // enable session support for passport
   app.use(function(req, res, next) {
      log.debug("req.isAuthenticated()=[" + req.isAuthenticated() + "]");
      res.locals.isAuthenticated = req.isAuthenticated();
      if (req.isAuthenticated()) {
         res.locals.user = {
            username : req.user.username,
            accessToken : req.user.tokens.accessToken,
            accessTokenExpiration : req.user.tokens.accessTokenExpiration
         }
      }

      next();
   });
   app.use(require('./middleware/flash_message_helper'));            // stores flash messages in res.locals for use in views

   // configure passport
   require('./middleware/auth')(UserModel);

   // ROUTING ----------------------------------------------------------------------------------------------------------

   // configure routing
   app.use('/api/v1/users', require('./routes/api/users')(UserModel));
   app.use('/', require('./routes/index'));

   // ERROR HANDLERS ---------------------------------------------------------------------------------------------------

   // custom 404
   app.use(error_handlers.http404);

   // dev and prod should handle errors differently: e.g. don't show stacktraces in prod
   app.use((app.get('env') === 'development') ? error_handlers.development : error_handlers.production);

});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
   console.error('Failed to connect to database on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
   log.info('Mongoose default connection to database disconnected');
});

var gracefulExit = function() {
   mongoose.connection.close(function() {
      log.info('Mongoose connection with database is disconnected due to app termination');
      process.exit(0);
   });
};

// If the Node process ends, close the Mongoose connection
process
      .on('SIGINT', gracefulExit)
      .on('SIGTERM', gracefulExit);

// create the app and connect to the database
try {
   app = express();
   log.info("Environment: " + app.get('env'));

   module.exports = app;
   mongoose.connect(config.get("database:url"), config.get("database:options"));
   log.info("Connecting to database...");
}
catch (err) {
   log.error("Sever initialization failed ", err.message);
}
