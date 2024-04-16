exports.handleCustomerError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};

exports.handlePsqlError = (err, req, res, next) => {
  const codes = ["23502", "22P02", "23503"];
  if (codes.includes(err.code)) {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};
