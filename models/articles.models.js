const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const { checkExists } = require("./all.models");

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

exports.fetchArticles = (
  topic,
  sort_by = "created_at",
  order_by = "desc",
  limit = 10,
  p = 0
) => {
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
  let countPQSLString = `SELECT COUNT(*) FROM articles `;
  let psqlString = `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const query = [];
  const countQuery = [];
  if (topic) {
    psqlString += `WHERE topic = $1 `;
    countPQSLString += `WHERE topic = $1 `;
    query.push(topic);
    countQuery.push(topic);
  }

  psqlString += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order_by} `;

  if ((limit && typeof +limit !== "number") || (p && typeof +p !== "number")) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }
  let offset = 0;
  if (p !== 0) {
    offset = (p - 1) * limit;
  }
  query.push(limit, offset);

  if (topic) {
    psqlString += `LIMIT $2 OFFSET $3;`;
  } else {
    psqlString += `LIMIT $1 OFFSET $2;`;
  }

  return Promise.all([
    db.query(psqlString, query),
    db.query(countPQSLString, countQuery),
  ]).then(([{ rows: articles }, { rows: count }]) => {
    if (topic && !articles.length) {
      return Promise.all([checkExists("topics", "slug", topic), count[0]]);
    }

    if (Math.ceil(count[0].count / limit) < p) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
    return [articles, count[0]];
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

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  const values = [author, title, body, topic];

  let psqlString = `INSERT INTO articles (author, title, body, topic`;

  let url = "";
  if (article_img_url) {
    psqlString += `, article_img_url`;
    url = article_img_url;
    values.push(url);
  }
  psqlString += `) VALUES ($1, $2, $3, $4`;

  if (article_img_url) {
    psqlString += `, $5`;
  }
  psqlString += `) RETURNING *;`;

  return db.query(psqlString, values).then(({ rows: newArticle }) => {
    if (newArticle.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
    return newArticle[0];
  });
};
