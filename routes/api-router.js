const { getEndpoints } = require("../controllers/all.controllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
