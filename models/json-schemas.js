module.exports.UserSchema = {
   "$schema" : "http://json-schema.org/draft-04/schema#",
   "title" : "User",
   "description" : "An ESDR user",
   "type" : "object",
   "properties" : {
      "username" : {
         "type" : "string",
         "minLength" : 4
      },
      "password" : {
         "type" : "string",
         "minLength" : 5
      },
      "email" : {
         "type" : "string",
         "minLength" : 6,
         "format" : "email"
      }
   },
   "required" : ["username", "password", "email"]
};