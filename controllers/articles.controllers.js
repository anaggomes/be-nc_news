const articles = require("../db/data/test-data/articles");
const {
  fetchArticleById,
  fetchArticles,
  updateArticleByIdVotes,
  checkArticleExists,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const queries = Object.keys(req.query);

  if (queries.length && !queries.includes("topic")) {
    return res.status(404).send({ message: "Not Found" });
  }

  const { topic } = req.query;

  return fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleByIdVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateArticleByIdVotes(article_id, inc_votes),
    checkArticleExists(article_id),
  ])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
