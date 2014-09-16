//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "com" if it doesn't exist.  Throw an error if it does exist but is not an object.
var com;
if (!com) {
   com = {};
}
else {
   if (typeof com != "object") {
      var comExistsMessage = "Error: failed to create com namespace: com already exists and is not an object";
      alert(comExistsMessage);
      throw new Error(comExistsMessage);
   }
}

// Repeat the creation and type-checking for the next level
if (!com.cattfish) {
   com.cattfish = {};
}
else {
   if (typeof com.cattfish != "object") {
      var comCattfishExistsMessage = "Error: failed to create com.cattfish namespace: com.cattfish already exists and is not an object";
      alert(comCattfishExistsMessage);
      throw new Error(comCattfishExistsMessage);
   }
}
//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!window['superagent']) {
   var noSuperagentMsg = "The superagent library is required by com.cattfish.AccessToken.js";
   alert(noSuperagentMsg);
   throw new Error(noSuperagentMsg);
}
//======================================================================================================================

(function() {

   com.cattfish.AccessToken = function() {

      var accessToken = null;

      this.load = function(callback) {
         if (accessToken != null) {
            console.log("Returning cached access token...");
            return callback(null, accessToken);
         }
         console.log("Fetching access token...");
         superagent
               .get("/access-token?no-cache=" + new Date().getTime())
               .end(function(err, res) {
                       if (err) {
                          var msg = "Failed to get the access token due to an unexpected error.";
                          console.log(msg);
                          return callback(new Error(msg));
                       }
                       // remember the accessToken for later, then return to the caller
                       accessToken = res.body.data ? res.body.data.token : null;
                       return callback(null, accessToken);
                    });
      };

      this.get = function() {
         return accessToken;
      };
   };

})();
