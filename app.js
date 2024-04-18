const express = require("express");

const {
  handleServerError,
  handleCustomerError,
  handlePsqlError,
  handlePsqlNotFoundError,
} = require("./errors/errors");

const apiRouter = require("./routes/api-router.js");
const topicsRouter = require("./routes/topics-router.js");
const articlesRouter = require("./routes/articles-router.js");
const commentsRouter = require("./routes/comments-router.js");
const usersRouter = require("./routes/users-router.js");
const app = express();

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api", apiRouter);

app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});
app.use(handlePsqlNotFoundError);
app.use(handlePsqlError);
app.use(handleCustomerError);
app.use(handleServerError);

module.exports = app;
