import { input, confirm, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { sanitizeFolderName } from './sanitize.js';
import { gitIgnore } from './tasks/git.js';
import { vsCode } from './tasks/vscode.js';
import { umbracoPackageManifest } from './tasks/umbracopackage.js';

function displayWelcome(){
    console.log(chalk.green.bold(figlet.textSync('Umbraco', { font: 'Thin'})));
}

async function startPrompts(){  

    const answers = {
        packageName: await input(
            { 
                message: "Package Name:",
                default: "My First Package",
            }),
        addGitIgnore: await confirm(
            { 
                message: "Do you want to add a gitignore file?",
                default: true
            }),
        useVSCode: await confirm(
            {
                message: "Do you want to use VSCode recommended extensions & settings?",
                default: true
            }),
        packageType: await checkbox(
            {
                message: "What do you want to add to your package?",
                choices: [
                    {
                        name: "Dashboard",
                        value: "dashboard"
                    },
                    {
                        name: "Property Editor",
                        value: "propertyEditor"
                    }
                ]
            })
    };

    // String array...
    console.log(answers.packageType)

    // Scaffold files based off prompt answers
    // Will also perform other actions such as git init and npm install ...
    scaffoldFiles(answers);
};

function scaffoldFiles(answers: any){
   
    // Create folder based on name of package
    const packageName = answers.packageName;
    const folderName = sanitizeFolderName(packageName);
    const folderPath = path.join(process.cwd(), folderName);

    // Create folder for package files
    console.log(`Creating Package Folder: ${chalk.yellow(folderName)} ${chalk.green(folderPath)}`);

    // Check if folder already exists
    // Log message and exit if it does
    if(fs.existsSync(folderPath)){
        console.log(`Folder already exists: ${chalk.red(folderPath)}`);
        console.log(`${chalk.red('Exiting... Bye bye')}`);
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

    // .github folder for dependabot or github actions ?

    // Prompt JSON schema - download from RAW github source
    // What version do you want to use ?

    
}

displayWelcome();
startPrompts();