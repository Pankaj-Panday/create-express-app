export function getNotFoundMiddlewareContent() {
  return `import CustomError from "../utils/customError.js";

export const handleNotFound = (req, res, next) => {
  const err = new CustomError(404, \`\${req.originalUrl} path does not exist!\`);
  next(err);
};`;
}
