var mongoose = require('mongoose');

var User = new mongoose.Schema({
                                  username : {
                                     type : String,
                                     unique : true,
                                     required : true
                                  },
                                  lastLogin : {
                                     type : Date,
                                     default : Date.now,
                                     required : true
                                  },
                                  tokens : {
                                     accessToken : {
                                        type : String,
                                        unique : true,
                                        required : true
                                     },
                                     accessTokenExpiration : {
                                        type : Date,
                                        required : true
                                     },
                                     refreshToken : {
                                        type : String,
                                        unique : true,
                                        required : true
                                     }
                                  }
                               });

// give a filtered view of a user
User.methods.toJSON = function() {
   return {
      username : this.username,
      lastLogin : this.lastLogin,
      accessToken : this.tokens.accessToken,
      accessTokenExpiration : this.tokens.accessTokenExpiration
   };
};

User.statics.findByUsername = function(username, callback) {
   UserModel.findOne({ username : username }, callback);
};

// =====================================================================================================================

var UserModel = mongoose.model('User', User);

// =====================================================================================================================

module.exports.UserModel = UserModel;
