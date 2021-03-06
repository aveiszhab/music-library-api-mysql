This is a course project part of the Manchester Codes curriculum. The project was built on Manchester Codes repository.

# MySQL Book Library API

The Music Library API stores information about artists, albums and songs. A CRUD REST API is implemented to interact with a MySQL database.

# Learning Objectives

  * Can you explain what a data schema is?
  * Can you design and implement an API with CRUD operations on a database?

# Concepts

  * Databases
  * Database Design
  * SQL
  * MySQL
  * Sequelize
  * Database Querying and CRUD operations


# Endpoints

https://documenter.getpostman.com/view/11208763/TVRhd9zC

# Development utilities used:

- The App was built using Express
- Testing: Mocha, Chai, supertest
- Packages: nodemon, dotenv, mysql2, sequelize

# Set up the project locally
 * Clone the repo
 https://github.com/aveiszhab/music-library-api-mysql
 * Install the project dependencies with npm i
 * Based on the .env.example create two files on the route of your project: .env (realted to your production database) and .env.test (related to your test database).
    * DB_PASSWORD: replace *smy-secret-pw* with a password of your choosing. Make sure you use the same passord in the .env and the .env.test files
    *   DB_NAME replace *music_library* with a name of your choosing. Make sure you DO NOT USE the same name in the .env and the .env.test files. (e.g.: music_library and music_library_test)
* Run a docker MySQL container by using the following command:

        docker run -d -p 3307:3306 --name music_library_mysql -e MYSQL_ROOT_PASSWORD=<PASSWORD> mysql

        Make sure to replace <PASSWORD> with a password of your choosing.
* For testing run:

        npm test

* Start the server:

        npm start 

* use postman to test the routes

# Author:
Aniko Veiszhab