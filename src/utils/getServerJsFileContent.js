export function getServerJsFileContent({ useMongoose, useCookieParser, useEJS, useCors }) {
  const imports = [
    `import dotenv from "dotenv";`,
    `dotenv.config({ path: [".env"] });`,
    `import express from "express";`,
    useMongoose && `import connectMongoDB from "./utils/dbConnect.js";`,
    useCors && `import cors from "cors";`,
    useCookieParser && `import cookieParser from "cookie-parser";`,
    `import path from "path";`,
    `import { fileURLToPath } from "url";`,
    `import { handleNotFound } from "./middlewares/notFoundMiddleware.js";`,
    `import { globalErrorHandler } from "./middlewares/errorMiddleware.js";`,
  ];

  const setup = [
    `const app = express();`,
    `const __filename = fileURLToPath(import.meta.url);`,
    `const __dirname = path.dirname(__filename);`,
    ``,
    useCookieParser && `app.use(cookieParser());`,
    `app.use(express.json());`,
    `app.use(express.urlencoded({ extended: true }));`,
    useCors &&
      `app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);`,
    ``,
    `// Server static files`,
    `app.use(express.static(path.join(__dirname, "public")));`,
    ``,
    useEJS &&
      `// set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));`,
  ];

  const routesAndErrors = [
    `app.get("/", (req, res) => {
  res.send("API is running");
});`,
    ``,
    `// Add your routes here`,
    ``,
    `// Default route - should always be last`,
    `app.all("/{*splat}", handleNotFound);`,
    ``,
    `// Express global error handler for route errors`,
    `app.use(globalErrorHandler);`,
  ];

  const serverStart = useMongoose
    ? `connectMongoDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, console.log(\`Server started on http://localhost:\${PORT}\`));
});`
    : `const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(\`Server started on http://localhost:\${PORT}\`));`;

  // Combine all blocks into one code string
  return [...imports, ``, ...setup, ``, ...routesAndErrors, ``, serverStart]
    .filter((elem) => elem !== false)
    .join("\n");
}
