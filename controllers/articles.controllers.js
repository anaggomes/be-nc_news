const {
  insertArticleById,
  insertArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  insertArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  insertArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
