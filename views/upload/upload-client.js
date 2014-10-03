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

(function() {

   var SENSOR_MISSING_FLAG = 0x10;

   com.cattfish.Device = function(deviceConfig) {
      var samples = [];
      var ignoredSamples = [];
      var channels = {};
      var minTime = Number.MAX_VALUE;
      var maxTime = Number.MIN_VALUE;

      deviceConfig.fields.forEach(function(channelName) {
         channels[channelName] = {
            min : Number.MAX_VALUE,
            max : Number.MIN_VALUE
         };
      });

      var getDecimalNumberParts = function(num, expectedLengthOfMantissa) {
         num = String(num);   // make sure it's a string
         var parts = {characteristic : 0, mantissa : 0};

         if (num.indexOf('.') >= 0) {
            parts.characteristic = parseInt(num.substring(0, num.indexOf('.')));
            var mantissa = num.substring(num.indexOf('.') + 1);
            if (mantissa.length < expectedLengthOfMantissa) {
               for (var i = mantissa.length; i < expectedLengthOfMantissa; i++) {
                  mantissa += "0";
               }
            }
            parts.mantissa = parseInt(mantissa);
         }
         else {
            parts.characteristic = parseInt(num);
         }

         return parts;
      };

      var computeCrc = function(temperature, conductivity, voltage, errorCodes) {
         // the characteristic and mantissa are summed separately
         var tempParts = getDecimalNumberParts(temperature, 1);   // at most 1 mantissa digits for temperature
         var voltageParts = getDecimalNumberParts(voltage, 2);    // at most 2 mantissa digits for voltage

         // sum up all the parts, and then stuff it into unsigned 8 bits, then return
         var crc = new Uint8Array(1);
         crc[0] = tempParts.characteristic +
                  tempParts.mantissa +
                  parseInt(conductivity) +
                  parseInt(errorCodes) +
                  voltageParts.characteristic +
                  voltageParts.mantissa;
         return crc[0];
      };

      this.add = function(record, errorCodes, expectedChecksum) {
         if (record) {
            // first check whether the sensor was missing--if so, then we don't need to compute the CRC
            var isSensorMissing = (errorCodes > 0) && (errorCodes & SENSOR_MISSING_FLAG) === SENSOR_MISSING_FLAG;
            if (isSensorMissing) {
               ignoredSamples.push(record);
            }
            else {
               // now compute and check the checksum
               var actualChecksum = computeCrc(record[1], record[2], record[3], errorCodes);
               if (expectedChecksum == actualChecksum) {
                  if (record[2] <= 0) {
                     console.log(record);
                  }
                  var time = record[0];
                  minTime = Math.min(minTime, time);
                  maxTime = Math.max(maxTime, time);
                  samples.push(record);
                  if (record[1] == -1 || record[2] == -1 || record[3] == -1) {
                     console.log(record);
                  }

                  for (var i = 0; i < deviceConfig.fields.length; i++) {
                     var channelName = deviceConfig.fields[i];
                     var value = record[i + 1];
                     channels[channelName].min = Math.min(channels[channelName].min, value);
                     channels[channelName].max = Math.max(channels[channelName].max, value);
                  }
               }
               else {
                  ignoredSamples.push(record);
               }
            }
         }
      };

      this.toObj = function() {
         return {
            device : {
               serialNumber : deviceConfig.serialNumber,
               protocolVersion : deviceConfig.protocolVersion
            },
            data : {
               channels : channels,
               fields : deviceConfig.fields,
               minTime : minTime,
               maxTime : maxTime,
               samples : samples,
               ignoredSamples : ignoredSamples
            }
         };
      };
   };

})();

//======================================================================================================================

var device = null;

window.addEventListener("message",
                        function(event) {
                           if (event.origin.indexOf("{{{cattfishUrl}}}") != 0) {
                              console.log("Ignoring message from unexpected origin [" + event.origin + "]");
                              return;
                           }

                           // if the framed content is loaded, then send it the device data
                           if (device) {
                              if (event.data && event.data.isLoaded) {
                                 event.source.postMessage(device.toObj(), "{{{cattfishUrl}}}")
                              }
                           }
                           else {
                              // TODO
                              alert("No data!");
                           }
                        },
                        false);

//======================================================================================================================
