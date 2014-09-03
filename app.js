// dependencies
var express = require('express');
var cors = require('cors');
var app = express();

var log = require('log4js').getLogger();
log.info("Environment: " + app.get('env'));

var config = require('./config');
var expressHandlebars = require('express3-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var compress = require('compression');
var requestLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var SessionStore = require('express-mysql-session');
var flash = require('connect-flash');
var Database = require("./models/Database");

// decorate express.response with JSend methods
require('./lib/jsend');

var gracefulExit = function() {
   // TODO: any way (or need?) to gracefully shut down the database pool?
   log.info("Shutting down...");
   process.exit(0);
};

// If the Node process ends, then do a graceful shutdown
process
      .on('SIGINT', gracefulExit)
      .on('SIGTERM', gracefulExit);

// start by initializing the database and getting a reference to it
Database.create(function(err, db) {
   if (err) {
      log.error("Failed to initialize the database!" + err);
   }
   else {
      log.info("Database initialized, starting app server...");

      // configure the app
      try {
         // VIEW -------------------------------------------------------------------------------------------------------------

         // setup view engine
         var viewsDir = path.join(__dirname, 'views');
         app.set('views', viewsDir);
         var handlebars = expressHandlebars.create({
                                                      extname : '.hbs',
                                                      defaultLayout : 'main',
                                                      layoutsDir : path.join(viewsDir, "layouts"),
                                                      partialsDir : path.join(viewsDir, "partials"),
                                                      helpers : {
                                                         // Got this from http://stackoverflow.com/a/9405113
                                                         ifEqual : function(v1, v2, options) {
                                                            if (v1 === v2) {
                                                               return options.fn(this);
                                                            }
                                                            return options.inverse(this);
                                                         }
                                                      }
                                                   });

         app.engine('hbs', handlebars.engine);
         app.set('view engine', '.hbs');
         app.set('view cache', app.get('env') === 'production');           // only cache views in production
         log.info("View cache enabled = " + app.enabled('view cache'));

         // MIDDLEWARE -------------------------------------------------------------------------------------------------
         var error_handlers = require('./middleware/error_handlers');

         // setup middleware
         app.use(favicon(path.join(__dirname, 'public/favicon.ico')));     // favicon serving
         app.use(cors({
                         origin : '*'
                      }));
         app.use(compress());                // enables gzip compression
         app.use(express.static(path.join(__dirname, 'public')));          // static file serving
         app.use(requestLogger('dev'));      // request logging
         app.use(bodyParser.urlencoded({ extended : true }));     // form parsing
         app.use(bodyParser.json());         // json body parsing
         app.use(function(error, req, res, next) { // function MUST have arity 4 here!
            // catch invalid JSON error (found at http://stackoverflow.com/a/15819808/703200)
            res.status(400).json({status : "fail", data : "invalid JSON"})
         });
         app.use(flash());                   // adds a req.flash() function to all requests for displaying one-time messages to the user
         app.use(cookieParser());            // cookie parsing--MUST come before setting up session middleware!
         app.use(session({                   // configure support for storing sessions in the database
                            key : config.get("cookie:name"),
                            secret : config.get("cookie:secret"),
                            store : new SessionStore({
                                                        host : config.get("database:host"),
                                                        port : config.get("database:port"),
                                                        database : config.get("database:database"),
                                                        user : config.get("database:username"),
                                                        password : config.get("database:password")
                                                     }),
                            saveUninitialized : true,
                            resave : false               // default is true, but why???
                         }));
         app.use(passport.initialize());                                   // initialize passport (must come AFTER session middleware)
         app.use(passport.session());                                      // enable session support for passport
         app.use(function(req, res, next) {
            log.debug("req.isAuthenticated()=[" + req.isAuthenticated() + "]");
            res.locals.isAuthenticated = req.isAuthenticated();
            if (req.isAuthenticated()) {
               res.locals.user = {
                  id : req.user.id,
                  accessToken : req.user.accessToken
               };
               delete req.session.redirectToAfterLogin;
               delete res.locals.redirectToAfterLogin;
            }
            else {
               // expose the redirectToAfterLogin page to the view
               res.locals.redirectToAfterLogin = req.session.redirectToAfterLogin;
            }

            next();
         });
         app.use(require('./middleware/flash_message_helper'));            // stores flash messages in res.locals for use in views

         // configure passport
         require('./middleware/auth')(db.users);

         // ROUTING ----------------------------------------------------------------------------------------------------

         // configure routing
         app.use('/api/v1/users', require('./routes/api/users')(db.users));
         app.use('/api/v1/user-verification', require('./routes/api/user-verification'));
         app.use('/login', require('./routes/login'));
         app.use('/logout', require('./routes/logout'));
         app.use('/password-reset', require('./routes/password-reset')(db.users));
         app.use('/',
                 function(req, res, next) {
                    // if serving a page which doesn't require authentication, then
                    // forget the remembered redirectToAfterLogin page
                    delete req.session.redirectToAfterLogin;
                    next();
                 },
                 require('./routes/index'));
         app.use('/', require('./routes/authenticated'));

         // ERROR HANDLERS ---------------------------------------------------------------------------------------------

         // custom 404
         app.use(error_handlers.http404);

         // dev and prod should handle errors differently: e.g. don't show stacktraces in prod
         app.use((app.get('env') === 'development') ? error_handlers.development : error_handlers.production);

         // ------------------------------------------------------------------------------------------------------------

         // set the port and start the server
         app.set('port', config.get("server:port"));
         var server = app.listen(app.get('port'), function() {
            log.info('Express server listening on port ' + server.address().port);
         });

      }
      catch (err) {
         log.error("Sever initialization failed ", err.message);
      }
   }
});

