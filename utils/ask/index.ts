import chalk from "chalk";
import readline from "node:readline";

export default function ask(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(chalk.cyan(query), (ans: string) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}
