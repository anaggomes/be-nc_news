const articles = require("../db/data/test-data/articles");
const {
  fetchArticleById,
  fetchArticles,
  updateArticleByIdVotes,
  checkArticleExists,
  insertArticle,
  fetchArticlesPagination,
} = require("../models/articles.models");

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
  const validQueries = ["sort_by", "order_by", "topic", "limit", "p"];

  queries.forEach((query) => {
    if (queries.length && !validQueries.includes(query)) {
      return res.status(400).send({ message: "Bad Request" });
    }
  });

  const { topic, sort_by, order_by, limit, p } = req.query;

  return fetchArticles(topic, sort_by, order_by, limit, p)
    .then(([articles, { count }]) => {
      res.status(200).send({ articles, total_count: count });
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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  insertArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
      const newArticleId = newArticle.article_id;
      return fetchArticleById(newArticleId);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
