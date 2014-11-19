cattfish.com
============

The cattfish.com web site.

Setup
=====

1. Install the module dependencies:

        npm install
    
2. Install ESDR.

3. Do the following to create the development MySQL database and user:

        CREATE DATABASE IF NOT EXISTS cattfish_dev;
        GRANT ALL PRIVILEGES ON cattfish_dev.* To 'cattfish_dev'@'localhost' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish_dev.* TO 'cattfish_dev'@'localhost';

    If you choose to change the password, make sure it matches the password in `config-dev.json`.

4. If you want to be able to run the tests, do the following to create the test database and user:

        CREATE DATABASE IF NOT EXISTS cattfish_test;
        GRANT ALL PRIVILEGES ON cattfish_test.* To 'cattfish_test'@'localhost' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish_test.* TO 'cattfish_test'@'localhost';

    If you choose to change the password, make sure it matches the password in `config-test.json`.

5. If running in production, dow the following:

    1. Create the `config-prod.json` file. Just copy from the other config, but you need only include the parts that differ from `config.js`.

    2. Do the following to create the production database and user:

            CREATE DATABASE IF NOT EXISTS cattfish_prod;
            GRANT ALL PRIVILEGES ON cattfish_prod.* To 'cattfish_prod'@'localhost' IDENTIFIED BY 'USE_A_GOOD_PASSWORD_HERE';
            GRANT SELECT,INSERT,UPDATE,DELETE,CREATE ON cattfish_prod.* TO 'cattfish_prod'@'localhost';

        Again, make sure the user and password you specify matches those in `config-prod.json`.

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