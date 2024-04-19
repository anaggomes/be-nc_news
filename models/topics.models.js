const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.insertTopic = (slug, description) => {
  const values = [slug];

  let psqlString = `INSERT INTO topics VALUES ($1`;

  if (description) {
    psqlString += `, $2`;
    values.push(description);
  }
  psqlString += `) RETURNING *`;

  return db.query(psqlString, values).then(({ rows: topics }) => {
    return topics[0];
  });
};
