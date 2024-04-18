const {
  deleteCommentById,
  patchCommentVotes,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
