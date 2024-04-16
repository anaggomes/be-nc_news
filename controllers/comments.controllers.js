const { checkArticleExists } = require("../models/articles.models");
const { fetchCommentsByArticleID } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentsByArticleID(article_id),
    checkArticleExists(article_id),
  ])

    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
