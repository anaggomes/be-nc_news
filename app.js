const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/topics.controllers");
const {
  handleServerError,
  handleCustomerError,
  handlePsqlError,
} = require("./errors/errors");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

app.use(handlePsqlError);
app.use(handleCustomerError);
app.use(handleServerError);

module.exports = app;
