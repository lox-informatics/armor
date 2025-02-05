import chalk from "chalk";
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const isWindows: boolean = process.platform === "win32";

export async function ensureExecutable(scriptPath: string): Promise<void> {
  try {
    await fs.access(scriptPath, fs.constants.X_OK);
  } catch {
    await fs.chmod(scriptPath, 0o755);
  }
}

export async function getBashCommand(scriptPath: string): Promise<string> {
  if (isWindows) {
    const gitPath: string = process.env.GIT_PATH || "C:\\Program Files\\Git";
    const cygpath: string = `"${gitPath}\\usr\\bin\\cygpath.exe"`;
    const unixScriptPath: string = (
      await execAsync(`${cygpath} "${scriptPath}"`)
    ).stdout.trim();
    const bashCommand: string = `"${gitPath}\\bin\\bash.exe"`;
    return `${bashCommand} -c "${unixScriptPath}"`;
  } else {
    return `bash -c "${scriptPath}"`;
  }
}

export default async function bash(
  scriptPath: string,
  args: string[] = []
): Promise<string> {
  await ensureExecutable(scriptPath); // Ensure the script is executable

  try {
    const command: string = await getBashCommand(
      `${scriptPath} ${args.join(" ")}`
    );
    const { stdout, stderr } = await execAsync(command);

    if (stdout) console.log(chalk.green(stdout.trim()));
    if (stderr) console.error(chalk.yellow(stderr.trim()));

    return stdout.trim(); // Return stdout as the result
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error executing script: ${errorMessage}`));
    throw error; // Rethrow error to allow the caller to handle it
  }
}
