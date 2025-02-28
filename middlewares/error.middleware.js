const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.code === "11000") {
      const message = "Duplicate field value";
      error = new Error(message);
      error.statusCode = 400;
    }

    if (error.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }
    if (err.name === "JsonWebTokenError") {
      const message = "Invalid token";
      error = new Error(message);
      error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
      const message = "Token expired";
      error = new Error(message);
      error.statusCode = 401;
    }

    if (err.name === "UnauthorizedError") {
      const message = "Unauthorized";
      error = new Error(message);
      error.statusCode = 401;
    }

    if (err.name === "ForbiddenError") {
      const message = "Forbidden";
      error = new Error(message);
      error.statusCode = 403;
    }

    if (err.name === "NotFoundError") {
      const message = "Not found";
      error = new Error(message);
      error.statusCode = 404;
    }
    if (err.name === "BadRequestError") {
      const message = "Bad request";
      error = new Error(message);
      error.statusCode = 400;
    }
    if (err.name === "InternalServerError") {
      const message = "Internal server error";
      error = new Error(message);
      error.statusCode = 500;
    }

    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
