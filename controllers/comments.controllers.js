const { checkArticleExists } = require("../models/articles.models");
const { insertCommentsByArticleID } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    insertCommentsByArticleID(article_id),
    checkArticleExists(article_id),
  ])

    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
