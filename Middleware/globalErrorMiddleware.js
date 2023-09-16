const errInDevMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errInprodMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const invalidTokenSignature = () =>
  new ApiError("invalid token signature, login again...", 401);

const tokenExpiredError = () =>
  new ApiError("Your session has expired please login again...", 401);

const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode | 500;
  err.status = err.status | "error";
  if (process.env.NODE_ENV === "development") errInDevMode(err, res);
  else {
    if (err.name === "JsonWebTokenError") err = invalidTokenSignature();
    if (err.name === "TokenExpiredError") err = tokenExpiredError();
    errInprodMode(err, res);
  }
};

module.exports = globalErrorMiddleware;
