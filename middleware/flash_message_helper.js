// store the flash messages in res.locals
module.exports = function(req, res, next) {
   res.locals.flashMessages = {
      info : req.flash('info'),
      error : req.flash('error')
   };
   next();
};