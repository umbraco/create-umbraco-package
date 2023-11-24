import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export async function vite(folderName: string) {
  // Copy the file from the template folder
  const viteFolderPath = path.join(process.cwd(), folderName);

  console.log(
    `Creating vite config & clean-up: ${chalk.green(viteFolderPath)}`
  );

  // Use import.meta Module to help get the correct path
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#getting_current_modules_file_path
  const viteTemplateFolderPath = new URL(
    path.join("..", "scaffolds", "vite"),
    import.meta.url
  );

  // Copy the entire vite folder
  fs.cpSync(viteTemplateFolderPath, viteFolderPath, { recursive: true });

  // clean up the default vite files:
  fs.rmSync(path.join(viteFolderPath, "index.html"));
  fs.rmSync(path.join(viteFolderPath, "public"), { recursive: true });
  fs.rmSync(path.join(viteFolderPath, "src", "assets"), { recursive: true });
  fs.rmSync(path.join(viteFolderPath, "src", "index.css"));
  fs.rmSync(path.join(viteFolderPath, "src", "my-element.js"));

  // Remove direct lit dependency from vite
  await execSync(`npm uninstall –D lit`, {
    cwd: viteFolderPath,
    stdio: "inherit",
  });
}
