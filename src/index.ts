import { input, confirm, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { sanitizeFolderName } from './sanitize.js';
import { exec, execSync } from 'child_process';

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
      
    console.log(answers.packageName);
    console.log(answers.addGitIgnore);

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


    // If gitignore is required, create it
    if(answers.addGitIgnore){
        // Copy the file from the template folder 
        const gitIgnorePath = path.join(process.cwd(), folderName, ".gitignore");
        console.log(`Creating GitIgnore File: ${chalk.green(gitIgnorePath)}`);

        //fs.copyFileSync("./templates/gitignore.txt", gitIgnorePath);

        // Run git init for the user
        runGitInit(folderPath);
    }
}

function runGitInit(folderPath:string){
    exec('git init', { cwd: folderPath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        
        console.log(`Git Init: ${stdout}`);
        console.error(`Git Init Error: ${chalk.red(stderr)}`);
    });
}


displayWelcome();
startPrompts();