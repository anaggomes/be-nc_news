exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};

exports.handleCustomerError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};

exports.handlePsqlError = (err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
};
