const { checkArticleExists } = require("../models/articles.models");
const {
  fetchCommentsByArticleID,
  insertCommentByArticleId,
  removeCommentById,
  checkCommentExists,
} = require("../models/comments.models");

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

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  Promise.all([checkCommentExists(comment_id), removeCommentById(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
