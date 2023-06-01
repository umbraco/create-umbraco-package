import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export function gitIgnore(answers: any, folderName: string, folderPath: string) {
    if (answers.addGitIgnore) {
        // Copy the file from the template folder 
        const gitIgnorePath = path.join(process.cwd(), folderName, ".gitignore");
        console.log(`Creating GitIgnore File: ${chalk.green(gitIgnorePath)}`);

        // Use import.meta Moduel to help get the correct path
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#getting_current_modules_file_path
        const gitTemplateFilePath = new URL("../scaffolds/gitignore/_gitignore.txt", import.meta.url);

        // Use fs-extra to copy folder in a post build script
        fs.copyFileSync(gitTemplateFilePath, gitIgnorePath);

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
        
        if(stdout){
            console.log(`Git Init: ${chalk.yellow(stdout)}`);
        }

        if(stderr){
            console.error(`Git Init Error: ${chalk.red(stderr)}`);
        }
    });
}
