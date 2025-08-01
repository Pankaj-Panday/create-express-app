import { execSync } from "child_process";

export function checkGitInstalled() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}
