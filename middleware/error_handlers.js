var httpStatus = require('http-status');
var log = require('log4js').getLogger();

var getFormatObject = function(res, statusCode, message) {
   return {
      "text/html" : function() {
         res.render('error', {layout : "error-layout", title : "HTTP " + statusCode, message : message});
      },
      "text/plain" : function() {
         res.send("Error " + statusCode + ": " + message + "\n");
      },
      "application/json" : function() {
         res.send({ status : statusCode, message : message });
      },
      "application/xml" : function() {
         res.end("<error><status>" + statusCode + "</status><message>" + message + "</message></error>\n");
      }
   };
};

module.exports = {
   http404 : function(req, res) {
      log.info("In 404 error handler!");
      var statusCode = httpStatus.NOT_FOUND;
      res.status(statusCode).format(getFormatObject(res, statusCode, "Resource not found"));
   },

   development : function(err, req, res, next) {
      log.debug("In DEV error handler...");
      log.error(err);
      var statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR;
      res.status(statusCode).format(getFormatObject(res, statusCode, err.message));
   },

   production : function(err, req, res, next) {
      log.debug("In PROD error handler!" + err);
      log.error(err);
      var statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR;
      res.status(statusCode).format(getFormatObject(res, statusCode, "Sorry, an unexpected error occurred."));
   }
};