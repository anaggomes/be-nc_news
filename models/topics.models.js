const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.insertArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }

      return rows[0];
    });
};
