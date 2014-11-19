cattfish.com
============

The cattfish.com web site.

Setup
=====

1. Install the module dependencies:

        npm install
    
2. Do the following to create the MySQL database and user:

        CREATE DATABASE IF NOT EXISTS cattfish;
        GRANT ALL PRIVILEGES ON cattfish.* To 'cattfish'@'localhost' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish.* TO 'cattfish'@'localhost';

    Make sure the password you specify matches the password in the config JSON.

3. If you want to run the tests, do the following to create the test database and user:

        CREATE DATABASE IF NOT EXISTS cattfish_test;
        GRANT ALL PRIVILEGES ON cattfish_test.* To 'cattfish'@'localhost' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish_test.* TO 'cattfish'@'localhost';

    Again, make sure the password you specify matches the password in the `config-test.json`.

Run
===

To run the server in development mode, do any of the following:

    npm start
    NODE_ENV=dev npm start
    NODE_ENV=development npm start
    
To run the server in test mode, do:

    NODE_ENV=test npm start

To run the server in production mode, do either of the following:

    NODE_ENV=prod npm start
    NODE_ENV=production npm start

Development
===========
To generate the CSS from the SCSS template, do:

   npm run-script gen-css

To compile the handlebars templates, do:

   npm run-script gen-handlebars