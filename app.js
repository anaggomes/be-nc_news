const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
} = require("./controllers/topics.controllers");
const {
  handleServerError,
  handleCustomerError,
  handlePsqlError,
} = require("./errors/errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

app.use(handlePsqlError);
app.use(handleCustomerError);
app.use(handleServerError);

module.exports = app;
