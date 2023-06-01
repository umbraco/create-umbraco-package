import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function umbracoPackageManifest(answers: any, folderName: string, folderPath: string) {
    // if (answers.addGitIgnore) {
    //     // Copy the file from the template folder 
    //     const gitIgnorePath = path.join(process.cwd(), folderName, ".gitignore");
    //     console.log(`Creating umbraco-package.json manifest File: ${chalk.green(gitIgnorePath)}`);

    //     // Use import.meta Moduel to help get the correct path
    //     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#getting_current_modules_file_path
    //     const gitTemplateFilePath = new URL("./scaffolds/umbracopackagejson/umbraco-package.json", import.meta.url);

    //     // Use fs-extra to copy folder in a post build script
    //     fs.copyFileSync(gitTemplateFilePath, gitIgnorePath);

    //     // Populate the JSON file with the different extension types
    // }
}