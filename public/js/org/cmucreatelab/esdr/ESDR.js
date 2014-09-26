//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "org" if it doesn't exist.  Throw an error if it does exist but is not an object.
var org;
if (!org) {
   org = {};
}
else {
   if (typeof org != "object") {
      var orgExistsMessage = "Error: failed to create org namespace: org already exists and is not an object";
      alert(orgExistsMessage);
      throw new Error(orgExistsMessage);
   }
}

if (!org.cmucreatelab) {
   org.cmucreatelab = {};
}
else {
   if (typeof org.cmucreatelab != "object") {
      var orgCmucreatelabExistsMessage = "Error: failed to create org.cmucreatelab namespace: org.cmucreatelab already exists and is not an object";
      alert(orgCmucreatelabExistsMessage);
      throw new Error(orgCmucreatelabExistsMessage);
   }
}

if (!org.cmucreatelab.esdr) {
   org.cmucreatelab.esdr = {};
}
else {
   if (typeof org.cmucreatelab.esdr != "object") {
      var orgCmucreatelabEsdrExistsMessage = "Error: failed to create org.cmucreatelab.esdr namespace: org.cmucreatelab.esdr already exists and is not an object";
      alert(orgCmucreatelabEsdrExistsMessage);
      throw new Error(orgCmucreatelabEsdrExistsMessage);
   }
}
//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!window['superagent']) {
   var noSuperagentMsg = "The superagent library is required by org.cmucreatelab.esdr.ESDR.js";
   alert(noSuperagentMsg);
   throw new Error(noSuperagentMsg);
}
//======================================================================================================================

(function() {

   org.cmucreatelab.esdr.ESDR = function(esdrApiRootUrl, accessToken) {

      var authorizationHeader = {
         Authorization : "Bearer " + accessToken
      };

      this.devices = {

         list : function(productName, callbacks) {
            superagent
                  .get(esdrApiRootUrl + "/products/" + productName + "/devices")
                  .set(authorizationHeader)
                  .end(function(err, res) {
                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 200:
                                return callbacks.success(res.body.data);
                             case 401:
                                return callbacks.unauthorized();
                             default:
                                return callbacks.error(res.body);
                          }
                       });
         },

         /**
          * TODO: document me (all callbacks MUST be defined)
          * Callbacks:
          * - success(device)
          * - unauthorized()
          * - notFound()
          * - error(responseBody)
          */
         get : function(productName, deviceSerialNumber, callbacks) {

            superagent
                  .get(esdrApiRootUrl + "/products/" + productName + "/devices/" + deviceSerialNumber)
                  .set(authorizationHeader)
                  .end(function(err, res) {
                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 200:
                                return callbacks.success(res.body.data);
                             case 401:
                                return callbacks.unauthorized();
                             case 404:
                                return callbacks.notFound();
                             default:
                                return callbacks.error(res.body);
                          }
                       });

         },

         /**
          * TODO: document me (all callbacks MUST be defined)
          * Callbacks:
          * - success(insertedDevice)
          * - duplicate()
          * - validationError(validationErrors)
          * - error(responseBody)
          */
         create : function(productName, deviceSerialNumber, callbacks) {
            superagent
                  .post(esdrApiRootUrl + "/products/" + productName + "/devices")
                  .set(authorizationHeader)
                  .send({serialNumber : deviceSerialNumber})
                  .end(function(err, res) {
                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 201:
                                return callbacks.success(res.body.data);
                             case 409:
                                return callbacks.duplicate();
                             case 422:
                                return callbacks.validationError(res.body.data);
                             default:
                                return callbacks.error(res.body);
                          }
                       });
         }

      };

      this.feeds = {

         /**
          * TODO: document me (all callbacks MUST be defined)
          */
         get : function(deviceId, callbacks) {
            superagent
                  .get(esdrApiRootUrl + "/devices/" + deviceId + "/feeds")
                  .set(authorizationHeader)
                  .end(function(err, res) {
                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 200:
                                return callbacks.success(res.body.data);
                             case 401:
                                return callbacks.unauthorized();
                             case 403:
                                return callbacks.forbidden();
                             case 404:
                                return callbacks.notFound();
                             default:
                                return callbacks.error(res.body);
                          }
                       });
         },

         /**
          * TODO: document me (all callbacks MUST be defined)
          */
         create : function(deviceId, feed, callbacks) {
            superagent
                  .post(esdrApiRootUrl + "/devices/" + deviceId + "/feeds")
                  .set(authorizationHeader)
                  .send(feed)
                  .end(function(err, res) {
                          if (typeof callbacks.complete === 'function') {
                             callbacks.complete();
                          }

                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 201:
                                return callbacks.success(res.body.data);
                             case 401:
                                return callbacks.unauthorized();
                             case 403:
                                return callbacks.forbidden();
                             case 404:
                                return callbacks.notFound();
                             case 422:
                                return callbacks.validationError(res.body.data);
                             default:
                                return callbacks.error(res.body);
                          }
                       });
         },

         upload : function(feedApiKey, data, callbacks) {
            superagent
                  .put(esdrApiRootUrl + "/feeds")
                  .set({
                          ApiKey : feedApiKey
                       })
                  .send(data)
                  .end(function(err, res) {
                          if (typeof callbacks.complete === 'function') {
                             callbacks.complete();
                          }

                          if (err) {
                             return callbacks.error(err, res.status);
                          }

                          switch (res.status) {
                             case 200:
                                return callbacks.success(res.body.data);
                             case 401:
                                return callbacks.unauthorized();
                             case 422:
                                return callbacks.validationError(res.body.data);
                             default:
                                return callbacks.error(res.body);
                          }
                       });
         }


      };
   };

})();
