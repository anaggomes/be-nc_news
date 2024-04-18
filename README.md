# Northcoders News API

Welcome to my backend project!

This is the RESTful API for Northcoders News, a Reddit-like application, developed using Node.js and PostgreSQL. The purpose of this project is to provide a platform where users can share articles, comment on them, and vote for their favorites.

The hosted version of this project can be found on https://nc-news-dkoj.onrender.com

- Database hosted on ElephantSQL
- API hosted on Render

## Getting Started

To get started with this project, follow these instructions:

### Prerequisites

Before running the server, make sure you have the following installed on your machine:

- Node.js v21.7.1
- Postgress server version 16.2

### Installation

1. Fork this repository
2. Clone the forked repository

   `git clone <repository-url>`

3. Create two .env files:

   - `.env.test`
   - `.env.development`

4. Into each `.env` file, add `PGDATABASE=`, with the correct database name for that environment (see /db/setup.sql for the database names)

   - please ensure the `.env` files are .git.ignored

5. Install the dependencies

   `npm install`

6. Set-up database

   `npm run setup-bds`

   ### Test database

   This project uses jest as a testing framework. The test database is being re-seeded before each test.
   To run the test file use the following command:

   `npm test`

   ### Development database

   1. To seed the database run:

   `npm run seed`

   2. To start the server, run the following command:

   `npm run start`

   By default, the server will run on port 9090. You can access the API at http://localhost:9090/api

## Endpoints

- GET /api : Get all endpoints of the api
- GET /api/topics : Get all topics
- GET /api/articles : Get all articles. Accepts queries: "author", "topic", "sort_by", "order"
- GET /api/articles/:article_id : Get an article by ID
- GET /api/articles/:article_id/comments : Get all comments for an article.
- GET /api/users : Get all users
- GET /api/users/:username : Get an user by username
- POST /api/articles/:article_id/comments : Add a new comment to an article
- PATCH /api/articles/:article_id : Increment or decrement the votes of an article
- DELETE /api/comments/:comment_id : Delete a comment

For more detailed information about each endpoint, refer to the `endpoints.json` file

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## Acknowledgments

This project was developed as part of the Northcoders Software Development bootcamp curriculum.
