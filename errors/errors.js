exports.handleCustomerError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};
exports.handlePsqlNotFoundError = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  }
  next(err);
};
exports.handlePsqlError = (err, req, res, next) => {
  const codes = ["23502", "22P02"];
  if (codes.includes(err.code)) {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};
