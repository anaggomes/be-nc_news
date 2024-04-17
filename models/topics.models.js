const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows: topics }) => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return [];
    });
};
