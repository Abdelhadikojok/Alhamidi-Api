const CustomError = require("../utils/custumeError");

const prodErrors = (res, error) => {
  if (error.isOperational) {
    // y3ni 3m et2akad 2za maslan 3mel post for data but he dont fill the complete form this is called operational error
    res.status(error.statusCode).json({
      error: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      error: "error",
      message: "-- server error --",
    });
  }
};

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    error: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const casteError = (error) => {
  return new CustomError(
    `the id that u give ${error.value} is invalid ${error.path}`,
    400
  );
};

const TokenExpireError = () => {
  return new CustomError(`please make sure you are logedin`, 401);
};

const TokensignatureError = () => {
  return new CustomError(`the token signature is invalid`, 401);
};

module.exports = (error, req, res, next) => {
  error.status = error.status || "error";
  error.statusCode = error.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    console.log({ ...error });
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "TokenExpiredError") {
      error = TokenExpireError();
    }
    if (error.name === "JsonWebTokenError") {
      error = TokensignatureError();
    }
    if (error.name === "CastError") {
      error = casteError(error);
    }
    prodErrors(res, error);
  }
};
