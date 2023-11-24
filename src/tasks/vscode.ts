import chalk from "chalk";
import fs from "fs";
import path from "path";

export async function vsCode(answers: any, folderName: string) {
  if (answers.useVSCode) {
    // Copy the file from the template folder
    const vsCodeFolderPath = path.join(process.cwd(), folderName, ".vscode");
    console.log(
      `Creating VSCode folder for recommended extensions & settings: ${chalk.green(
        vsCodeFolderPath
      )}`
    );

    // Use import.meta Module to help get the correct path
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#getting_current_modules_file_path
    const vsCodeTemplateFolderPath = new URL(
      "../scaffolds/vscode",
      import.meta.url
    );

    // Copy the entire .vscode folder
    await fs.cpSync(vsCodeTemplateFolderPath, vsCodeFolderPath, {
      recursive: true,
    });
  }
}
