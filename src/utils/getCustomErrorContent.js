export function getCustomErrorContent() {
  return `class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "failed" : "error";
    this.isOperational = true;
    this.name = this.constructor.name; // this.constructor.name gives us the name of the class/function using which a particular object was created and we are creating a local property called name and making it equal to that.

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;`;
}
