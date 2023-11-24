import { input, confirm, checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import { sanitizeFolderName } from "./sanitize.js";
import { gitIgnore } from "./tasks/git.js";
import { vsCode } from "./tasks/vscode.js";
import { umbracoPackageManifest } from "./tasks/umbracopackage.js";
import { readdir } from "fs/promises";

const umbracoExamplesDirectory =
  "node_modules/@umbraco-cms/backoffice/examples";

function getExampleDirectory(folderName: string) {
  return umbracoExamplesDirectory + "/" + folderName;
}

const getDirectories = async (source: string) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

function displayWelcome() {
  console.log(chalk.green.bold(figlet.textSync("Umbraco", { font: "Thin" })));
}

async function startPrompts() {
  // Find sub folder:
  const exampleFolderNames = await getDirectories(umbracoExamplesDirectory);
  const exampleFolderChoices = exampleFolderNames.map((folderName) => {
    return {
      name: folderName,
      value: folderName,
    };
  });

  const answers = {
    packageName: await input({
      message: "Package Name:",
      default: "My First Package",
    }),
    addGitIgnore: await confirm({
      message: "Do you want to add a gitignore file?",
      default: true,
    }),
    useVSCode: await confirm({
      message: "Do you want to use VSCode recommended extensions & settings?",
      default: true,
    }),
    packageExample: await checkbox({
      message: "What do you want to add an example to your package?",
      choices: exampleFolderChoices,
    }),
  };

  // Scaffold files based off prompt answers
  // Will also perform other actions such as git init and npm install ...
  scaffoldFiles(answers);
}

function scaffoldFiles(answers: any) {
  // Create folder based on name of package
  const packageName = answers.packageName;
  const folderName = sanitizeFolderName(packageName);
  const folderPath = path.join(process.cwd(), folderName);

  // Create folder for package files
  console.log(
    `Creating Package Folder: ${chalk.yellow(folderName)} ${chalk.green(
      folderPath
    )}`
  );

  // Check if folder already exists
  // Log message and exit if it does
  if (fs.existsSync(folderPath)) {
    console.log(`Folder already exists: ${chalk.red(folderPath)}`);
    console.log(`${chalk.red("Exiting... Bye bye")}`);
    return;
  }

  // Make the folder
  fs.mkdirSync(folderPath);

  // Copy gitignore & git init command
  gitIgnore(answers, folderName, folderPath);

  // Copy .vscode folder for recommended extensions & settings
  vsCode(answers, folderName);

  // Copy Umbraco package manifest
  umbracoPackageManifest(answers, folderName, folderPath);

  // TODO: Missing TSC setup?

  // .github folder for dependabot or github actions ?

  // Prompt JSON schema - download from RAW github source
  // What version do you want to use ?

  if (answers.packageExample.length > 0) {
    answers.packageExample.forEach((exampleFolderName: string) => {
      const srcDir = getExampleDirectory(exampleFolderName);
      console.log("copy", srcDir, "to", folderName);
      fs.cpSync(srcDir, folderPath, { recursive: true });
    });
  }
}

displayWelcome();
startPrompts();
