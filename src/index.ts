import { execSync } from "child_process";
import { gitIgnore } from "./tasks/git.js";
import { input, confirm, checkbox } from "@inquirer/prompts";
import { readdir } from "fs/promises";
import { resolve } from "import-meta-resolve";
import { sanitizeFolderName } from "./sanitize.js";
import { umbracoPackageManifest } from "./tasks/umbracopackage.js";
import { vsCode } from "./tasks/vscode.js";
import { vite } from "./tasks/vite.js";
import chalk from "chalk";
import figlet from "figlet";
import fs from "fs";
import path from "path";

(async () => {
  const umbracoExamplesDirectory = await resolve(
    path.join("@umbraco-cms", "backoffice", "examples"),
    import.meta.url
  )
    .replace("/index.js", "") // TODO: Support windows?
    .replace("file://", "");

  if (umbracoExamplesDirectory === undefined) {
    console.error("Could not find @umbraco-cms/backoffice package");
    console.error(
      "This script uses new features that is set to come in a later nodeJS version. so please wait for this."
    );
    return;
  }

  console.log("umbracoExamplesDirectory", umbracoExamplesDirectory);

  function getExampleDirectory(folderName: string) {
    return path.join(umbracoExamplesDirectory, folderName);
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
    const exampleFolderNames = await getDirectories(umbracoExamplesDirectory!);
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

  async function scaffoldFiles(answers: any) {
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
    //fs.mkdirSync(folderPath);
    //Make Vite project:
    //try {
    await execSync(`npm create vite@latest ${folderName} -- --template lit`, {
      stdio: "inherit",
    });
    //} catch (error) {
    // Nothing, cause this is most likely just the server begin stopped.
    //console.log(error);
    //}

    if (!fs.existsSync(folderPath)) {
      console.log(`Vite project creation failed? at: ${chalk.red(folderPath)}`);
      return;
    }

    // Copy .vscode folder for recommended extensions & settings
    await vsCode(answers, folderName);

    // Copy vite scaffold folder for vite config and clean up.
    await vite(folderName);

    // Copy Umbraco package manifest
    umbracoPackageManifest(answers, folderName, folderPath);

    // Append Umbraco-backoffice as a dependency
    await execSync(`npm install -D @umbraco-cms/backoffice@latest`, {
      cwd: folderPath,
      stdio: "inherit",
    });

    // Prompt JSON schema - download from RAW github source
    // What version do you want to use ?

    if (answers.packageExample.length > 0) {
      answers.packageExample.forEach((exampleFolderName: string) => {
        const srcDir = getExampleDirectory(exampleFolderName);
        fs.cpSync(srcDir, path.join(folderPath, "src"), { recursive: true });
      });
    }
  }

  displayWelcome();
  startPrompts();
})();
