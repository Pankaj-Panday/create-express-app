import { getUserInput } from "./input.js";
import { generateProject } from "./generateFiles.js";
import ora from "ora";

async function main() {
  const input = await getUserInput();
  const spinner = ora("Setting up your project...").start();

  try {
    await generateProject(input);
    const successMsg = `Project setup completed`;
    spinner.succeed(successMsg);
  } catch (error) {
    spinner.fail("Failed to create project.");
    console.error(error);
  }
}

main();
