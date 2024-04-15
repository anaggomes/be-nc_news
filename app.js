const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleServerError } = require("./errors/errors");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

app.use(handleServerError);
module.exports = app;
