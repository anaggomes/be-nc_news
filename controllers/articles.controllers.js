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
  const validQueries = ["sort_by", "order_by", "topic"];

  queries.forEach((query) => {
    if (queries.length && !validQueries.includes(query)) {
      return res.status(400).send({ message: "Bad Request" });
    }
  });

  const { topic, sort_by, order_by } = req.query;

  return fetchArticles(topic, sort_by, order_by)
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
