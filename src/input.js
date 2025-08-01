import prompts from "prompts";

export async function getUserInput() {
  return await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Name of the project:",
      initial: "my-app",
    },
    {
      type: "toggle",
      name: "useMongoose",
      message: "Include mongoose?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "toggle",
      name: "useCookieParser",
      message: "Include cookie-parser?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "toggle",
      name: "useCors",
      message: "Include cors package?",
      initial: false,
      active: "yes",
      inactive: "no",
    },
    {
      type: "toggle",
      name: "useEJS",
      message: "Use EJS?",
      initial: false,
      active: "yes",
      inactive: "no",
    },
    {
      type: "toggle",
      name: "useGit",
      message: "Initialize git repo?",
      initial: false,
      active: "yes",
      inactive: "no",
    },
  ]);
}
