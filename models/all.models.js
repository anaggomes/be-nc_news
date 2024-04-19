const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const psqlString = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(psqlString, [value]).then(({ rows: dbOutput }) => {
    if (dbOutput.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }

    return [];
  });
};
