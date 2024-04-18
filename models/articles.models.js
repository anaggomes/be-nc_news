const db = require("../db/connection");
const { checkExists } = require("./utils.models");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return articles[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order_by = "desc") => {
  const validOrderBys = ["asc", "desc"];
  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  if (!validSortBys.includes(sort_by) || !validOrderBys.includes(order_by)) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let psqlString = `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const query = [];

  if (topic) {
    psqlString += `WHERE topic = $1 `;
    query.push(topic);
  }

  psqlString += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order_by};`;

  return db
    .query(psqlString, query)

    .then(({ rows: articles }) => {
      if (topic && !articles.length)
        return checkExists("topics", "slug", topic);

      return articles;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
};

exports.updateArticleByIdVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows: article }) => {
      return article[0];
    });
};
