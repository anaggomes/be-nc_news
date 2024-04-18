const { use } = require("../app");
const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows: user }) => {
      if (!user.length) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return user[0];
    });
};
