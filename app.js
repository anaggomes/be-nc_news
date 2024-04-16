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
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

app.use(handlePsqlError);
app.use(handleCustomerError);
app.use(handleServerError);

module.exports = app;
