export function getErrorMiddlewareContent() {
  return `import CustomError from "../utils/customError.js";

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV !== "production") {
    devErrors(res, err);
  } else {
    // Mongoose cast error (example: providing string to a number field)
    if (err.name === "CastError") err = castErrorHandler(err);

    // Add more errors here

    prodErrors(res, err);
  }
};

function devErrors(res, error) {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
}

// Error Handlers
function castErrorHandler(error) {
  const msg = \`Invalid value for \${error.path}: \${error.value}\`;
  return new CustomError(400, msg);
}

// Add your error handlers here


function prodErrors(res, error) {
  if (error.isOperational === true) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: "Something went wrong! Please try again later.",
    });
  }
}`;
}