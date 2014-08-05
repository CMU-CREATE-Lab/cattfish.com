var assert = require('assert');
var should = require('should');
var agent = require('supertest');
var mysql = require('mysql');
var config = require('../config');
var flow = require('nimble');
var Database = require("../models/Database");
var esdr = require('../lib/esdr');
var ValidationError = require('../lib/errors').ValidationError;
var RemoteError = require('../lib/errors').RemoteError;
var DuplicateRecordError = require('../lib/errors').DuplicateRecordError;
var log = require('log4js').getLogger();

describe("cattfish.com", function() {
   var url = config.get("server:url");
   var createTestUser = function() {
      return {
         email : "tackaberry_" + new Date().getTime() + "@mcadoo.com",
         password : "Tackaberry McAdoo is a fantastic name",
         displayName : "Tackaberry McAdoo"
      };
   };
   var db = null;

   var pool = mysql.createPool({
                                  connectionLimit : config.get("database:pool:connectionLimit"),
                                  host : config.get("database:host"),
                                  port : config.get("database:port"),
                                  database : config.get("database:database"),
                                  user : config.get("database:username"),
                                  password : config.get("database:password")
                               });

   // make sure the database tables exist and, if so, wipe the tables clean
   before(function(initDone) {
      // make sure the client exists in ESDR
      esdr.createClient({
                           displayName : config.get("oauth:clientDisplayName"),
                           clientName : config.get("oauth:clientId"),
                           clientSecret : config.get("oauth:clientSecret")
                        },
                        function(err, result) {
                           if (err) {
                              if (err instanceof RemoteError && err.data && err.data.code == 409) {
                                 log.info("Client already exists in ESDR, no creation necessary.");
                              }
                              else {
                                 throw err;
                              }
                           }
                           else {
                              if (result.code == 201) {
                                 log.info("Client created in ESDR.");
                              }
                              else {
                                 throw new Error("Unexpected result code from ESDR when creating client: " + result.code);
                              }
                           }

                           Database.create(function(err, theDatabase) {
                              if (err) {
                                 throw err;
                              }
                              db = theDatabase;
                              pool.getConnection(function(err, connection) {
                                 if (err) {
                                    throw err;
                                 }

                                 flow.series([
                                                function(done) {
                                                   connection.query("DELETE FROM sessions", function(err) {
                                                      if (err) {
                                                         throw err;
                                                      }

                                                      done();
                                                   });
                                                },
                                                function(done) {
                                                   connection.query("DELETE FROM Users", function(err) {
                                                      if (err) {
                                                         throw err;
                                                      }

                                                      done();
                                                   });
                                                }
                                             ],
                                             function() {
                                                initDone();
                                             });
                              });
                           });
                        });
   });

   describe("Database", function() {
      describe("Users", function() {
         describe("create", function() {

            var testUser = createTestUser();
            var verificationTokens = {};

            it("Should be able to create a new user", function(done) {
               db.users.create(testUser, function(err, result) {
                  if (err) {
                     return done(err);
                  }
                  result.should.have.property("id");
                  // we're running in test mode, so the verification
                  // token is passed back rather than emailed
                  result.should.have.property("verificationToken");
                  verificationTokens.testUser = result.verificationToken;

                  done();
               });
            });

            it("Should fail if we attempt to register the same user again", function(done) {
               db.users.create(testUser, function(err, result) {
                  (typeof result === 'undefined' || result == null).should.be.true;
                  (err != null).should.be.true;
                  (err instanceof DuplicateRecordError).should.be.true;
                  err.data.should.have.property("email", testUser.email);
                  done();
               });
            });

            it("Should fail if we attempt to register the a user with the same email, but different password", function(done) {
               db.users.create({
                                  email : testUser.email,
                                  password : testUser.password + " this makes it different",
                                  displayName : testUser.displayName
                               },
                               function(err, result) {
                                  (typeof result === 'undefined' || result == null).should.be.true;
                                  (err != null).should.be.true;
                                  (err instanceof DuplicateRecordError).should.be.true;
                                  err.data.should.have.property("email", testUser.email);
                                  done();
                               });
            });

            it("Should fail to create an invalid user", function(done) {
               db.users.create({
                                  email : "foobar",       // not a valid email address
                                  password : "X"          // too short
                               },
                               function(err, result) {
                                  (typeof result === 'undefined' || result == null).should.be.true;
                                  (err != null).should.be.true;
                                  (err instanceof ValidationError).should.be.true;
                                  err.should.have.property("data");
                                  err.data.should.have.length(2);

                                  done();
                               });
            });

         });
      });
   });
});