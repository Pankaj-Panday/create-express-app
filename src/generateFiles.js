import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { getNotFoundMiddlewareContent } from "./utils/getNotFoundMiddlewareContent.js";
import { getEnvFileContent } from "./utils/getEnvFileContent.js";
import { getGitIgnoreFileContent } from "./utils/getGitIgnoreFileContent.js";
import { getDBConnectFileContent } from "./utils/getDBConnectFileContent.js";
import { getServerJsFileContent } from "./utils/getServerJsFileContent.js";
import { getAsyncHandlerContent } from "./utils/getAsyncHandlerContent.js";
import { getCustomErrorContent } from "./utils/getCustomErrorContent.js";
import { getErrorMiddlewareContent } from "./utils/getErrorMiddlewareContent.js";
import { checkGitInstalled } from "./utils/helper.js";

export async function generateProject({ projectName, useMongoose, useCookieParser, useEJS, useCors, useGit }) {
  // create project folder
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`Folder "${projectName}" already exists!`);
    process.exit(1);
  }
  await fs.ensureDir(projectPath);

  // Folders
  const folders = ["controllers", "middlewares", "routes", "public", "views", "utils"];
  if (useMongoose) folders.push("models");
  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }

  // Files
  // create .env file
  await fs.writeFile(path.join(projectPath, ".env"), getEnvFileContent());

  // create .gitignore file
  if (useGit) {
    await fs.writeFile(path.join(projectPath, ".gitignore"), getGitIgnoreFileContent());
  }

  // create dbConnect.js file
  if (useMongoose) {
    await fs.writeFile(path.join(projectPath, "utils", "dbConnect.js"), getDBConnectFileContent());
  }

  // create asyncHandler.js
  await fs.writeFile(path.join(projectPath, "utils", "asyncHandler.js"), getAsyncHandlerContent());

  // create customError.js
  await fs.writeFile(path.join(projectPath, "utils", "customError.js"), getCustomErrorContent());

  // create notFoundMiddleware.js
  await fs.writeFile(path.join(projectPath, "middlewares", "notFoundMiddleware.js"), getNotFoundMiddlewareContent());

  // create errorMiddleware.js
  await fs.writeFile(path.join(projectPath, "middlewares", "errorMiddleware.js"), getErrorMiddlewareContent());

  // create server.js
  await fs.writeFile(
    path.join(projectPath, "server.js"),
    getServerJsFileContent({ useMongoose, useCookieParser, useEJS, useCors })
  );

  const dependencies = ["express", "dotenv"];
  if (useCors) dependencies.push("cors");
  if (useCookieParser) dependencies.push("cookie-parser");
  if (useMongoose) dependencies.push("mongoose");
  if (useEJS) dependencies.push("ejs");

  const devDependencies = ["nodemon"];

  // create custom package.json
  const pkgJson = {
    name: projectName,
    version: "1.0.0",
    main: "server.js",
    type: "module",
    scripts: {
      dev: "NODE_ENV=development nodemon server.js",
      start: "NODE_ENV=production node server.js",
    },
    keywords: [],
    author: "",
    license: "ISC",
    description: "",
  };

  await fs.writeJson(path.join(projectPath, "package.json"), pkgJson, { spaces: 2 });

  // Install dependencies
  if (dependencies.length) {
    execSync(`npm install ${dependencies.join(" ")}`, { cwd: projectPath });
  }
  if (devDependencies.length) {
    execSync(`npm install -D ${devDependencies.join(" ")}`, { cwd: projectPath });
  }

  // initialise git repository and create initial commit
  if (useGit && checkGitInstalled()) {
    execSync("git init && git add . && git commit -m 'initial commit'", { cwd: projectPath });
  } else {
    console.warn("⚠️ Git is not installed. Skipping git init.");
  }
}
