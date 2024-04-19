const { checkArticleExists } = require("../models/articles.models");
const {
  fetchCommentsByArticleID,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentVotes,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const queries = Object.keys(req.query);
  const validQueries = ["limit", "p"];

  queries.forEach((query) => {
    if (queries.length && !validQueries.includes(query)) {
      return res.status(400).send({ message: "Bad Request" });
    }
  });
  const { limit, p } = req.query;

  Promise.all([
    fetchCommentsByArticleID(article_id, limit, p),
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

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateCommentVotes(inc_votes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
