To run these tests, do the following first:

1) In mysql, execute the following to create the test database and cattfish user:

      CREATE DATABASE IF NOT EXISTS cattfish_test;
      GRANT ALL PRIVILEGES ON cattfish_test.* To 'cattfish'@'localhost' IDENTIFIED BY 'password';
      GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish_test.* TO 'cattfish'@'localhost';

2) Run the ESDR server in test mode, like this:

      NODE_ENV=test npm start

   In test mode, the server runs on port 3001, so make sure you don't have anything else
   running on that port.

3) Run this server in test mode, like this:

      NODE_ENV=test npm start

   In test mode, the server runs on port 3334, so make sure you don't have anything else
   running on that port.

4) Run the tests:

      npm test