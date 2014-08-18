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
if (!window['$']) {
   var nojQueryMsg = "The jQuery library is required by com.cattfish.Messages.js";
   alert(nojQueryMsg);
   throw new Error(nojQueryMsg);
}
//======================================================================================================================

(function() {

   com.cattfish.Messages = function() {
      var messages = [];

      this.render = function(containerElement) {
         if (messages.length > 0) {
            containerElement.empty();
            messages.forEach(function(message) {
               containerElement.append('<div>' + message + '</div>');
            });
            containerElement.show();
         }
      };

      this.add = function(message) {
         if (message) {
            messages.push(message);
         }
      };

      this.isEmpty = function() {
         return messages.length == 0;
      };
   };

})();
